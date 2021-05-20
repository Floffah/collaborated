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
import fastifyHelmet from "fastify-helmet";
import fastifyCors from "fastify-cors";

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
            log: process.env.USE_DEBUG === "true" ? ["query", "info", "error", "warn"] : ["error", "warn"],
        });

        const redisport = parseInt(process.env.REDIS_PORT ?? "NaN");

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
            logger: { level: process.env.USE_DEBUG === "true" ? "info" : "warn" },
        });

        if (process.env.USE_CORS === "true") {
            this.info("Initialising cors");
            this.app.register(fastifyCors, {
                origin: [/\.apollographql\.com$/],
            });
        }

        if (process.env.USE_HELMET === "true") {
            this.info("Initialising helmet");
            this.app.register(fastifyHelmet, {});
        }

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
