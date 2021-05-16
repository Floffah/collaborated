import { buildArgument, buildField, buildObject } from "@collaborated/gql";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { QueryContext } from "../util/types.js";
import { queryArgs } from "../util/validation.js";
import { generateUserTokens } from "../util/tokens.js";

export const AuthDetails = buildObject<any, QueryContext>("AuthDetails; Post-authentication details", () => [
    buildField("access; The main access code or the current session", GraphQLString),
    buildField(
        "refresh; The refresh code that should be used to generate a new access code after the current session has ended",
        GraphQLString,
    ),
]);

export const mutation = buildObject<any, QueryContext>("RootMutation; Root mutation", () => [
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
            if (!user) throw "Invalid auth details";

            const tokens = generateUserTokens();
            user.access = tokens.access;
            user.refresh = tokens.refresh;

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
]);
