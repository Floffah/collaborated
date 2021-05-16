import fastify from "fastify";
import mercurius from "mercurius";
import { query } from "../graphql/query";
import { buildSchema } from "@collaborated/gql";
import { mutation } from "../graphql/mutation";
import { subscription } from "../graphql/subscription";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { RedisOptions } from "ioredis";
import debug from "debug";
import { getClientContext } from "../util/auth";
import { PrismaClient } from "@prisma/client";

export default class Server {
    db: PrismaClient;
    pubsub: RedisPubSub;
    app: ReturnType<typeof fastify>;
    info = debug("capp:server");

    async go() {
        await this.init();
        await this.start();
    }

    async init() {
        this.info("Initialising Prisma");
        this.db = new PrismaClient({
            log: ["query", "info", "error", "warn"],
        });

        const redisport = parseInt(process.env.REDIS_PORT ?? "NaN");
        console.log(redisport);

        const opts: RedisOptions = {
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PSWD,
            port: isNaN(redisport) ? 28920 : redisport,
            tls: {
                rejectUnauthorized: false,
                requestCert: true,
            },
        };

        this.info("Initialising Redis (PubSub)");
        this.pubsub = new RedisPubSub({
            // publisher: new IORedis(opts),
            // subscriber: new IORedis(opts),
            connection: opts,
        });

        this.info("Initialising Fastify");
        this.app = fastify({
            logger: { level: "warn" },
        });

        // const automaticpqp = mercurius.persistedQueryDefaults.automatic();
        //
        // const persistedQueryProvider: PersistedQueryProvider = {
        //     ...automaticpqp,
        //     getQueryFromHash: async (hash) => {
        //         const found = await this.db.persistedQuery.findFirst({
        //             where: {
        //                 hash: {
        //                     equals: hash,
        //                 },
        //             },
        //         });
        //         if (found === null) throw automaticpqp.notFoundError;
        //         return found.query;
        //     },
        //     saveQuery: async (hash, query) => {
        //         await this.db.persistedQuery.upsert({
        //             create: {
        //                 hash,
        //                 query,
        //             },
        //             update: {
        //                 query,
        //             },
        //             where: {
        //                 hash,
        //             },
        //         });
        //     },
        // };

        this.info("Initialising Mercurius");
        this.app.register(mercurius, {
            schema: buildSchema(query, mutation, subscription),
            prefix: "/v1",
            graphiql: "playground",
            jit: 1,
            context: async (req, _res) => ({
                db: this.db,
                ps: this.pubsub,
                req,
                ...(await getClientContext(this.db, req.headers)),
            }),
            // persistedQueryProvider, // may be re-enabled if necessary, currently this is only a disadvantage.
            subscription: {
                context: async (_conn, req) => {
                    return {
                        db: this.db,
                        ps: this.pubsub,
                        req,
                    };
                },
                onConnect: async (a) => {
                    return {
                        ...(await getClientContext(this.db, a.payload)),
                    };
                },
                pubsub: this.pubsub,
            },
            logLevel: "info",
        });

        this.app.get("/", (_req, res) => {
            res.send({
                v1: {
                    api: "/v1/graphql",
                    playground: "/v1/playground",
                    socket: "/v1/graphql",
                },
            });
        });
    }

    async start() {
        this.info("Starting Fastify");
        await this.app.listen(80);
        this.info("Started Fastify");
    }
}
