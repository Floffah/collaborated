import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import mercurius from "mercurius";
import { query } from "../graphql/query";
import { buildSchema } from "@collaborated/gql";
import PersistedQueryProvider = mercurius.PersistedQueryProvider;

export default class Server {
    db: PrismaClient;
    app: ReturnType<typeof fastify>;

    async go() {
        await this.init();
        await this.start();
    }

    async init() {
        this.db = new PrismaClient({
            log: ["query", "info", "error", "warn"],
        });
        this.app = fastify({
            logger: true,
        });

        const automaticpqp = mercurius.persistedQueryDefaults.automatic();

        const persistedQueryProvider: PersistedQueryProvider = {
            ...automaticpqp,
            getQueryFromHash: async (hash) => {
                const found = await this.db.persistedQuery.findFirst({
                    where: {
                        hash: {
                            equals: hash,
                        },
                    },
                });
                if (found === null) throw automaticpqp.notFoundError;
                return found.query;
            },
            saveQuery: async (hash, query) => {
                await this.db.persistedQuery.upsert({
                    create: {
                        hash,
                        query,
                    },
                    update: {
                        query,
                    },
                    where: {
                        hash,
                    },
                });
            },
        };

        this.app.register(mercurius, {
            schema: buildSchema(query),
            prefix: "/v1",
            graphiql: "playground",
            jit: 1,
            context: (_req, _res) => ({
                db: this.db,
            }),
            persistedQueryProvider,
        });

        this.app.get("/", (_req, res) => {
            res.send({
                v1: {
                    api: "/v1/graphql",
                    playground: "/v1/playground",
                },
            });
        });
    }

    async start() {
        this.app.listen(80);
    }
}
