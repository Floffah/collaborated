import { buildArgument, buildField, buildObject, LiteralTypeFields } from "@collaborated/gql";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { QueryContext } from "../../../util/types";
import { queryArgs } from "../../../util/validation";
import { generateUserTokens } from "../../../util/tokens";
import { UserInputError } from "apollo-server-micro";

export const AuthDetails = buildObject<any, QueryContext>("AuthDetails; Post-authentication details", () => [
    buildField("access; The main access code or the current session", GraphQLString),
    buildField(
        "refresh; The refresh code that should be used to generate a new access code after the current session has ended",
        GraphQLString,
    ),
]);

export const AuthFields: LiteralTypeFields<any, QueryContext> = [
    buildField(
        "getTokens; (USER) Generate new tokens to authenticate with",
        AuthDetails,
        async (_s, a, c) => {
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
        [
            buildArgument("email; Email to authenticate with", GraphQLNonNull(GraphQLString)),
            buildArgument("password; Password to authenticate with", GraphQLNonNull(GraphQLString)),
        ],
    ),
    buildField(
        "refresh; (USER) Refresh your access token",
        AuthDetails,
        async (_s, a, c) => {
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
        [
            buildArgument("refresh; Your refresh token", GraphQLNonNull(GraphQLString)),
            buildArgument(
                "access; Your access token. Must pass this as well for security purposes",
                GraphQLNonNull(GraphQLString),
            ),
        ],
    ),
];
