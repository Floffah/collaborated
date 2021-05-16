import { QueryContext, SubscriptionType } from "./types.js";
import { minutes } from "./time.js";
import { StateChange, StateChangeGQL } from "../graphql/subscription.js";

export function userValidation(context: QueryContext) {
    if (context.auth === "none") throw "Not authenticated; Must defined CAPP_AUTH; see docs/server/api.md#authentication";
    if (context.auth === "user" && context.user) {
        if (context.user.lastAccess.getTime() < Date.now() - minutes(20)) {
            context.ps.publish(SubscriptionType.sessionStateChange, {
                sessionStateChange: StateChangeGQL.get(StateChange.EXPIRE),
            });
            throw "Session expired;";
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
