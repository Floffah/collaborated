import {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import query from "./schema/query";
import WebSocket, {Server as WSServer} from "ws"
import Server from "./Server";
import GatewaySession from "./GatewaySession";
import {GatewayConnection} from "../db/Models";
import {Not} from "typeorm";
import {forWait} from "../util/arrays";

export default class API {
    server: Server
    route: Router
    ws: WSServer

    sessions: Map<number, GatewaySession> = new Map();

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

        this.ws = new WSServer({
            server: this.server.server,
            path: "/api/v1/gateway",
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                concurrencyLimit: 10,
                threshold: 1024
            }
        });
        this.ws.on("listening", () => {
            this.server.logger.info("Gateway websocket listening on path /api/v1/gateway");
        });
        this.ws.on("connection", socket => this.connection(socket));

        this.flush()
        setInterval(() => this.flush(), 60000);
    }

    flush() {
        this.server.db.getRepository(GatewayConnection).find({where: {authed: Not(true)}, select: ["guid"]}).then(gates => {
            forWait(gates, (gate, next) => {
                this.server.db.manager.delete<GatewayConnection>(GatewayConnection, gate).then(() => {
                    next();
                })
            });
        });
    }

    connection(socket: WebSocket) {
        let authed = false;
        let session: GatewaySession;

        setTimeout(() => {
            if(!authed) {
                socket.send(JSON.stringify({
                    type: "error",
                    error: GatewayErrors.AuthenticationTimeOut,
                    errorName: GatewayErrors[GatewayErrors.AuthenticationTimeOut]
                }), () => {
                    socket.close();
                });
            }
        }, 10000);

        socket.on("close", () => {
            if(session) {
                session.rid();
            }
        });

        socket.on("message", (data: string) => {
            if (isJson(data)) {
                let msg = JSON.parse(data);
                if (!authed) {
                    // authenticating
                    if ("type" in msg && msg.type === "auth" && "guid" in msg && "access" in msg) {
                        this.server.db.getRepository(GatewayConnection).findOne({
                            guid: msg.guid
                        }, {
                            loadEagerRelations: true,
                            relations: ["user"]
                        }).then((gate) => {
                            console.log(JSON.stringify(gate));
                            if (!!gate) {
                                if (!!gate.user && !!gate.user.id) {
                                    if (gate.user.access === msg.access) {
                                        session = new GatewaySession(socket, gate, this);
                                        this.sessions.set(gate.guid, session);
                                        authed = true;
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
                                        error: GatewayErrors.CouldNotFetchUser,
                                        errorName: GatewayErrors[GatewayErrors.CouldNotFetchUser]
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
    CouldNotFetchUser,
    AuthenticationTimeOut
}

function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
