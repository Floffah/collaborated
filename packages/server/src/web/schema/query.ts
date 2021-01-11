import API from "../API";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { query_me } from "./me";
import { User } from "../../db/Clients";
import { randomBytes } from "crypto";

export default function query(api: API) {
    return new GraphQLSchema({
        query: new GraphQLObjectType<any, { access?: string }>({
            name: "query",
            description: "Root query",
            fields: {
                me: {
                    type: query_me(api),
                    description: "For interacting with your own user.",
                    args: {
                        access: {
                            type: GraphQLString,
                            description: "Your user's access code",
                        },
                    },
                    async resolve(_, a, c) {
                        let ac = a.access;
                        if ("access" in c && typeof c === "object") {
                            ac = c.access;
                        }
                        const user = await api.server.db
                            .getRepository<User>(User)
                            .findOne({ access: ac });

                        if (user) {
                            return { user };
                        } else {
                            throw "Incorrect access code.";
                        }
                    },
                },
                getAccess: {
                    type: GraphQLString,
                    description:
                        "Generate an access token from your email and password (and 2fa code is applicable",
                    args: {
                        email: {
                            type: GraphQLString,
                            description: "Your account's email",
                        },
                        password: {
                            type: GraphQLString,
                            description: "Your account's password",
                        },
                    },
                    async resolve(_, { email, password }: any) {
                        const user = await api.server.db
                            .getRepository(User)
                            .findOne({
                                where: {
                                    email,
                                    password,
                                },
                            });

                        if (user) {
                            user.access = randomBytes(
                                api.server.cfg.val.info.accesslength / 2,
                            ).toString("hex");

                            const user2 = await api.server.db
                                .getRepository(User)
                                .save(user);

                            return user2.access;
                        } else {
                            throw "Could not find user matchine those details.";
                        }
                    },
                },
                ping: {
                    type: GraphQLString,
                    description: "For round-trip calculation purposes.",
                    resolve() {
                        return "pong";
                    },
                },
            },
        }),
    });
}
