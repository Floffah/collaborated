import API from "../API";
import {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";
import { GatewayConnection, User } from "../../db/Clients";
import { query_me_projects } from "./projects";

export function query_me(api: API) {
    return new GraphQLObjectType<{ user: User }>({
        name: "me",
        description: "GraphQL Object for interacting with your own user.",
        fields: {
            gateway: {
                type: query_me_gateway(api),
                args: {
                    listen: {
                        type: GraphQLList(GraphQLString),
                        description: "The events you want to listen for.",
                    },
                },
                description: "Create a new gateway",
                async resolve(s, args) {
                    const gt = await api.server.db.manager.findOne<GatewayConnection>(
                        GatewayConnection,
                        {
                            user: s.user,
                        },
                    );

                    const gate = new GatewayConnection();
                    gate.user = s.user;
                    gate.listen = args.listen;
                    if (gt) {
                        gate.guid = gt.guid;
                    }

                    const gatesave = await api.server.db.manager.save<GatewayConnection>(
                        gate,
                    );
                    return { gate: gatesave };
                },
            },
            projects: {
                type: query_me_projects(api),
                description:
                    "Field for interacting with projects relating to your user",
                resolve(s) {
                    return { user: s.user };
                },
            },
        },
    });
}

export function query_me_gateway(_api: API) {
    return new GraphQLObjectType({
        name: "gateway",
        description:
            "GraphQL Object for getting information about the gateway you just created.",
        fields: {
            url: {
                type: GraphQLString,
                description:
                    "The URL to the websocket gateway that you should use.",
                resolve(_s: { gate: GatewayConnection }) {
                    return "ws://localhost/api/v1/gateway";
                },
            },
            guid: {
                type: GraphQLInt,
                description:
                    "The unique id of your gateway connection that you will need to provide at the gate.",
                resolve(s: { gate: GatewayConnection }) {
                    return s.gate.guid;
                },
            },
        },
    });
}
