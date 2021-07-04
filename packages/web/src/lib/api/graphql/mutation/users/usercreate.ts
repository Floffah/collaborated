import { LimitType } from "@prisma/client";
import { withLimit } from "../../../../util/limits";
import { queryArgs } from "../../../../util/validation";
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";
import { nonNull, stringArg } from "nexus";

export const UserCreateFields = (t: ObjectDefinitionBlock<"Mutation">) => {
    t.boolean("createUser", {
        description: "Creates a user",
        args: {
            username: nonNull(stringArg({ description: "Name of the client" })),
            password: nonNull(stringArg({ description: "User's password" })),
            email: nonNull(stringArg({ description: "User's email" })),
        },
        resolve: async (_s, a, c) => {
            queryArgs(a, ["username", "password", "email"]);
            await withLimit(LimitType.CreateUser, c);

            const u = await c.db.user.create({
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

            return !!u;
        },
    });
};
