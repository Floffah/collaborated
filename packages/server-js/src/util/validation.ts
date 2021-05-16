import { QueryContext, SubscriptionType } from "./types.js";
import { minutes } from "./time.js";
import { StateChangeEnum } from "../graphql/subscription.js";

export function userValidation(context: QueryContext, noinvalidate?: boolean) {
    if (context.auth === "none") throw "Not authenticated; Must defined CAPP_AUTH; see docs/server/api.md#authentication";
    if (!noinvalidate && context.auth === "user" && context.user) {
        if (!context.user.expired && context.user.lastAccess.getTime() < Date.now() - minutes(20)) {
            context.ps.publish(SubscriptionType.sessionStateChange, {
                sessionStateChange: {
                    id: context.user.id,
                    sessionStateChange: StateChangeEnum.EXPIRE,
                },
            });
            context.user.expired = true;
            context.db.user.update({
                where: {
                    id: context.user.id,
                },
                data: context.user,
            });

            throw "Session expired;";
        } else if (context.user.expired) {
            throw "Session expired";
        }
    }
}

export function queryArgs<T>(args: T, required: (keyof T)[]) {
    const keys = Object.keys(args) as (string | number | symbol)[];

    for (const req of required) {
        if (!keys.includes(req)) {
            throw `Argument ${req} is not optional`;
        }
    }

    return true;
}
