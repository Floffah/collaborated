import {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import query from "./schema/query";
import WebSocket, {Server as WSServer} from "ws"
import Server from "./Server";
import GatewaySession from "./GatewaySession";
import {GatewayConnection} from "../db/Models";

export default class API {
    server: Server
    route: Router
    ws: WSServer

    sessions: Map<string, GatewaySession> = new Map();

    constructor(server: Server) {
        this.server = server;
    }

    init() {
        this.route = Router()
        this.server.app.use("/api/v1", this.route);
        this.route.use("/", graphqlHTTP({
            schema: query(this),
            graphiql: true
        }));
        this.server.logger.info("Built GraphQL schema");

        this.ws = new WSServer({server: this.server.server, path: "/api/v1/gateway"});
        this.ws.on("listening", () => {
            this.server.logger.info("Gateway websocket listening on path /api/v1/gateway");
        });
        this.ws.on("connection", socket => this.connection(socket));
    }

    connection(socket: WebSocket) {
        let authed = false;
        let session;

        socket.on("message", (data: string) => {
            if(isJson(data)) {
                let msg = JSON.parse(data);
                if(!authed) {
                    // authenticating
                    if("type" in msg && msg.type === "auth" && "guid" in msg && "access" in msg) {
                        this.server.db.manager.findOne<GatewayConnection>(GatewayConnection, {
                            guid: msg.guid
                        }).then((gate) => {
                            if(gate) {
                                if(gate.user.access === msg.access) {
                                    session = new GatewaySession(socket, gate);
                                } else {
                                    socket.send(JSON.stringify({
                                        type: "error",
                                        error: GatewayErrors.AuthDetailMismatch,
                                        errorName: GatewayErrors[GatewayErrors.AuthDetailMismatch]
                                    }), () => {
                                        socket.close()
                                    });
                                }
                            } else {
                                socket.send(JSON.stringify({
                                    type: "error",
                                    error: GatewayErrors.IncorrectAuthDetails,
                                    errorName: GatewayErrors[GatewayErrors.IncorrectAuthDetails]
                                }), () => {
                                    socket.close()
                                });
                            }
                        });
                    } else {
                        socket.send(JSON.stringify({
                            type: "error",
                            error: GatewayErrors.InvalidAuthDetails,
                            errorName: GatewayErrors[GatewayErrors.InvalidAuthDetails]
                        }), () => {
                            socket.close();
                        });
                    }
                } else {
                    // post-authenticated
                }
            }
        })
    }
}

enum GatewayErrors {
    InvalidAuthDetails,
    IncorrectAuthDetails,
    AuthDetailMismatch,
}

function isJson(str: string):boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
