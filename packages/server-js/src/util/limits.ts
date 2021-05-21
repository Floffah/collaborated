import { QueryContext } from "./types";
import { hours } from "./time";
import { FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage, Server } from "http";
import { createHash } from "crypto";
import { LimitLog, LimitType } from "@prisma/client";

export const LimitDurations = {
    CreateUser: hours(1),
};

export async function withLimit(type: LimitType, q: QueryContext) {
    const reqhash = fingerprint(q.req);

    let limit = await q.db.limitLog.findFirst({
        where: {
            fingerprint: reqhash,
            type: type,
        },
    });

    if (!limit) {
        limit = {
            fingerprint: reqhash,
            type: type,
        } as LimitLog;
    }

    if (limit.when && Date.now() < limit.when.getTime() + LimitDurations[type]) throw "Rate limited";
    limit["when"] = new Date();

    await q.db.limitLog.upsert({
        create: limit,
        update: {
            when: limit.when,
        },
        where: {
            fingerprint_type: {
                fingerprint: reqhash,
                type: type,
            },
        },
    });
}

// TODO: better fingerprinting
// Currently fingerprints are just the client's ip and user agent but I feel like that isn't very secure so i want to make a better way.

export const fingerprint = (req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>) =>
    createHash("md5")
        .update(`${req.ip} ${req.headers["user-agent"] ?? "NO USER AGENT"}`)
        .digest("hex");
