import { BotUser, PrismaClient, User } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage, Server } from "http";

export type QueryContext = {
    db: PrismaClient;
    ps: RedisPubSub;
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>;
    pubsub?: RedisPubSub;
    user?: User;
    bot?: BotUser;
    auth: "user" | "bot" | "none";
};

export enum SubscriptionType {
    sessionStateChange = "SESSION_STATE_CHANGE",
}
