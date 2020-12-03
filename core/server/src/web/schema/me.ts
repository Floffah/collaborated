import API from "../API";
import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {GatewayConnection, User} from "../../db/Clients";

export function query_me(api: API) {
    return new GraphQLObjectType({
        name: "me",
        description: "GraphQL Object for interacting with your own user.",
        fields: {
            gateway: {
                type: query_me_gateway(api),
                args: {
                    listen: {type: GraphQLList(GraphQLString), description: "The events you want to listen for."}
                },
                description: "Create a new gateway",
                resolve(s: { user: User, listen: string[] }) {
                    return new Promise((resolve, _reject) => {
                        api.server.db.manager.findOne<GatewayConnection>(GatewayConnection, {
                            user: s.user
                        }).then(gt => {
                            let gate = new GatewayConnection()
                            gate.user = s.user;
                            gate.listen = s.listen;
                            if (gt) {
                                gate.guid = gt.guid;
                            }
                            api.server.db.manager.save<GatewayConnection>(gate).then((gate) => {
                                resolve({gate})
                            });
                        });
                    });
                }
            }
        }
    })
}

export function query_me_gateway(_api: API) {
    return new GraphQLObjectType({
        name: "gateway",
        description: "GraphQL Object for getting information about the gateway you just created.",
        fields: {
            url: {
                type: GraphQLString,
                description: "The URL to the websocket gateway that you should use.",
                resolve(_s: { gate: GatewayConnection }) {
                    return "ws://localhost/api/v1/gateway"
                }
            },
            guid: {
                type: GraphQLInt,
                description: "The unique id of your gateway connection that you will need to provide at the gate.",
                resolve(s: { gate: GatewayConnection }) {
                    return s.gate.guid
                }
            }
        }
    })
}
