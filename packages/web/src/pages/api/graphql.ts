import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import { query } from "../../lib/api/graphql/query";
import { mutation } from "../../lib/api/graphql/mutation";
import { executor } from "../../lib/api/jit";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { getClientContext } from "../../lib/util/auth";
import { MicroContext } from "../../lib/util/types";
import { NextApiHandler } from "next";
import { makeSchema } from "nexus";
import { resolve } from "path";
import { PubSubRedisOptions } from "graphql-redis-subscriptions/dist/redis-pubsub";
import { subscription } from "../../lib/api/graphql/subscription";

const db = new PrismaClient();

let redisopts: PubSubRedisOptions;

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedisMock = require("ioredis-mock");
    const mockSub = new IORedisMock();
    const mockPub = mockSub.createConnectedClient();
    redisopts = {
        publisher: mockPub,
        subscriber: mockSub,
    };
} else {
    const port = parseInt(process.env.REDIS_PORT ?? "NaN");
    redisopts = {
        connection: {
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PSWD,
            port: isNaN(port) ? 28920 : port,
            tls: {
                rejectUnauthorized: false,
                requestCert: true,
            },
        },
    };
}

const pubsub = new RedisPubSub(redisopts);

//const schema = buildSchema(query, mutation, subscription);
const schema = makeSchema({
    contextType: {
        module: resolve(__dirname, "../../../../src/lib/util", "types.ts"),
        export: "QueryContext",
    },
    types: [query, mutation, subscription],
    outputs:
        process.env.NODE_ENV === "production"
            ? {}
            : {
                  schema: resolve(__dirname, "../../../../../../", "schema.graphql"),
                  typegen: resolve(__dirname, "../../../../src/lib/api", "typegen.ts"),
              },
});

const apollo = new ApolloServer({
    schema,
    executor: executor(schema),
    playground: {
        subscriptionEndpoint: "/api/graphql",
    },
    introspection: true,
    context: async (c: MicroContext) => {
        let extra: any = {};

        if (!c.connection) extra = { ...extra, ...(await getClientContext(db, c.req.headers)) };

        return {
            db,
            ps: pubsub,
            req: c.req,
            ...extra,
        };
    },
    subscriptions: {
        path: "/api/graphql",
        keepAlive: 9000,
        onConnect: async (params, _ws, context) => {
            return {
                ...(await getClientContext(db, params, context.request.headers)),
            };
        },
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default ((req: any, res: any, next: any) => {
    if (!res.socket.server.apollo) {
        apollo.installSubscriptionHandlers(res.socket.server);
        res.socket.server.apollo = apollo.createHandler({ path: "/api/graphql" });
    }

    return res.socket.server.apollo(req, res, next);
}) as NextApiHandler;
