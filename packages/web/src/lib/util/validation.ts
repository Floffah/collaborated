import { QueryContext, SubscriptionType } from "./types";
import { minutes } from "./time";
import { publishData } from "./subscription";
import { StateChangeEnum } from "../api/graphql/subscription/session";
import { AuthenticationError, UserInputError } from "apollo-server-micro";
import SessionError from "../api/errors/SessionError";

export function userValidation(context: QueryContext, noinvalidate?: boolean) {
    if (context.auth === "none")
        throw new AuthenticationError("Not authenticated; Must defined CAPP_AUTH; see docs/server/api.md#authentication");
    if (!noinvalidate && context.auth === "user" && context.user) {
        if (!context.user.expired && context.user.lastAccess.getTime() < Date.now() - minutes(20)) {
            context.ps.publish(
                SubscriptionType.sessionStateChange,
                publishData(
                    {
                        sessionStateChange: StateChangeEnum.EXPIRE,
                    },
                    {
                        id: 1,
                    },
                ),
            );
            context.user.expired = true;
            context.db.user.update({
                where: {
                    id: context.user.id,
                },
                data: context.user,
            });

            throw new SessionError("Session expired");
        } else if (context.user.expired) {
            throw new SessionError("Session expired");
        }
    }
}

export function botValidation(_context: QueryContext, _noinvalidate?: boolean) {
    // none needed yet
}

export function clientValidation(context: QueryContext, noinvalidate?: boolean) {
    if (context.auth === "user") {
        userValidation(context, noinvalidate);
    } else if (context.auth === "bot") {
        botValidation(context, noinvalidate);
    } else {
        throw new AuthenticationError("No user or bot defined");
    }
}

export function queryArgs<T>(args: T, required: (keyof T)[]) {
    const keys = Object.keys(args) as (string | number | symbol)[];

    for (const req of required) {
        if (!keys.includes(req)) {
            throw new UserInputError(`Argument ${req} is not optional`);
        }
    }

    return true;
}
