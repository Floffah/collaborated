import { queryArgs } from "../../../util/validation";
import { generateUserTokens } from "../../../util/tokens";
import { UserInputError } from "apollo-server-micro";
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";
import { nonNull, objectType, stringArg } from "nexus";

export const AuthDetails = objectType({
    name: "AuthDetails",
    description: "Post-authentication details",
    definition: (t) => {
        t.string("access", { description: "The main access code or the current session" });
        t.string("refresh", {
            description: "The refresh code that should be used to generate a new access code after the current session has ended",
        });
    },
});

export const AuthFields = (t: ObjectDefinitionBlock<"Mutation">) => {
    t.field("getTokens", {
        description: "(USER) Generate new tokens to authenticate with",
        type: AuthDetails,
        args: {
            email: nonNull(stringArg({ description: "Email to authenticate with" })),
            password: nonNull(stringArg({ description: "Password to authenticate with" })),
        },
        resolve: async (_s, a, c) => {
            queryArgs(a, ["email", "password"]);

            const user = await c.db.user.findFirst({
                where: {
                    email: a.email,
                    password: a.password,
                },
            });
            if (!user) throw new UserInputError("Invalid auth details");

            const tokens = generateUserTokens();
            user.access = tokens.access;
            user.refresh = tokens.refresh;
            user.expired = false;

            await c.db.user.update({
                where: {
                    id: user.id,
                },
                data: user,
            });

            return tokens;
        },
    });

    t.field("refresh", {
        type: AuthDetails,
        description: "(USER) Refresh your access token",
        args: {
            refresh: nonNull(stringArg({ description: "Your refresh token" })),
            access: nonNull(stringArg({ description: "Your access token. Must pass this as well for security purposes" })),
        },
        resolve: async (_s, a, c) => {
            queryArgs(a, ["refresh", "access"]);

            const user = await c.db.user.findFirst({
                where: {
                    access: a.access,
                    refresh: a.refresh,
                },
            });

            if (!user) throw new UserInputError("Invalid refresh and/or access");

            const tokens = generateUserTokens();
            user.refresh = tokens.refresh;
            user.expired = false;

            await c.db.user.update({
                where: {
                    id: user.id,
                },
                data: user,
            });

            return {
                access: user.access,
                refresh: tokens.refresh,
            };
        },
    });
};
