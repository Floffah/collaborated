import API from "../API";
import {GraphQLObjectType, GraphQLSchema, GraphQLString} from "graphql"
import {query_me} from "./me";
import {User} from "../../db/Clients";
import {randomBytes} from "crypto";

export default function query(api: API) {
    return new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "query",
            description: "Root query",
            fields: {
                me: {
                    type: query_me(api),
                    description: "For interacting with your own user.",
                    args: {
                        access: {type: GraphQLString, description: "Your user's access code"}
                    },
                    resolve(_, {access}: any, c) {
                        return new Promise((resolve, reject) => {
                            console.log(c);
                            let ac = access;
                            if (typeof c === "object" && "access" in c) {
                                ac = c.access;
                            }
                            api.server.db.getRepository<User>(User).findOne( {access: ac}).then(user => {
                                if (user) {
                                    resolve({user})
                                } else {
                                    reject("Incorrect access code.");
                                }
                            });
                        });
                    }
                },
                getAccess: {
                    type: GraphQLString,
                    description: "Generate an access token from your email and password (and 2fa code is applicable",
                    args: {
                        email: {type: GraphQLString, description: "Your account's email"},
                        password: {type: GraphQLString, description: "Your account's password"}
                    },
                    resolve(_, {email, password}: any) {
                        return new Promise((resolve, reject) => {
                            api.server.db.getRepository(User).findOne({
                                where: {
                                    email,
                                    password
                                }
                            }).then(user => {
                                if (user) {
                                    user.access = randomBytes(api.server.cfg.val.info.accesslength / 2).toString("hex")
                                    api.server.db.getRepository(User).save(user).then(user => {
                                        resolve(user.access);
                                    });
                                } else {
                                    reject("Could not find user matchine those details.")
                                }
                            });
                        });
                    }
                },
                ping: {
                    type: GraphQLString,
                    description: "For round-trip calculation purposes.",
                    resolve() {
                        return "pong"
                    }
                }
            }
        })
    })
}
