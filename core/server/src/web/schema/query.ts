import API from "../API";
import {GraphQLObjectType, GraphQLSchema, GraphQLString} from "graphql"
import {query_me} from "./me";
import {User} from "../../db/Models";

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
                    resolve(_, {access}: any) {
                        return new Promise((resolve, reject) => {
                            api.server.db.manager.findOne<User>(User, {access}).then(user => {
                                if(user) {
                                    resolve({user})
                                } else {
                                    reject("Incorrect access code.");
                                }
                            });
                        });
                    }
                }
            }
        })
    })
}
