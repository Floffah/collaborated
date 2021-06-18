import { QueryContext } from "./types";
import { hours } from "./time";
import { createHash } from "crypto";
import { LimitLog, LimitType } from "@prisma/client";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { AddressInfo } from "net";
import RateLimitError from "../api/errors/RateLimitError";

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

    if (limit.when && Date.now() < limit.when.getTime() + LimitDurations[type]) throw new RateLimitError();
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

export const fingerprint = (req: MicroRequest) =>
    createHash("md5")
        .update(
            `${req.socket.remoteAddress ?? (req.socket.address() as AddressInfo).address} ${
                req.headers["user-agent"] ?? "NO USER AGENT"
            }`,
        )
        .digest("hex");
