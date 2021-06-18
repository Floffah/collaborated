import { buildArgument, buildField, LiteralTypeFields } from "@collaborated/gql";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { LimitType } from "@prisma/client";
import { QueryContext } from "../../../../util/types";
import { withLimit } from "../../../../util/limits";
import { queryArgs } from "../../../../util/validation";

export const UserCreateFields: LiteralTypeFields<any, QueryContext> = [
    buildField(
        "createUser; Creates a user",
        GraphQLBoolean,
        async (_s, a, c) => {
            queryArgs(a, ["username", "password", "email"]);
            await withLimit(LimitType.CreateUser, c);

            await c.db.user.create({
                data: {
                    client: {
                        create: {
                            type: "USER",
                            username: a.username,
                        },
                    },
                    password: a.password,
                    email: a.email,
                },
            });
        },
        [
            buildArgument("username; Name of the client", GraphQLNonNull(GraphQLString)),
            buildArgument("password; User's password", GraphQLNonNull(GraphQLString)),
            buildArgument("email; User's email", GraphQLNonNull(GraphQLString)),
        ],
    ),
];
