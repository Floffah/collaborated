import {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import query from "./schema/query";
import WebSocket, {Server as WSServer} from "ws"
import Server from "./Server";
import GatewaySession, {GatewayMessageTypes} from "./GatewaySession";
import {GatewayConnection} from "../db/Clients";
import {Not} from "typeorm";
import {forWait} from "../util/arrays";
import EventPush from "./EventPush";
import {execute, GraphQLError, GraphQLSchema, parse, Source} from "graphql";
import cors from "cors";

export default class API {
    server: Server
    route: Router
    ws: WSServer

    sessions: Map<number, GatewaySession> = new Map();

    events: EventPush

    schema: GraphQLSchema = query(this)

    constructor(server: Server) {
        this.server = server;
    }

    init() {
        this.route = Router()
        this.server.app.use("/api/v1", this.route);

        this.route.use(cors());

        this.route.use("/", graphqlHTTP({
            schema: this.schema,
            graphiql: true,
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
        this.events = new EventPush(this);
        this.ws.on("listening", () => {
            this.server.logger.info("Gateway websocket listening on path /api/v1/gateway");
        });
        this.ws.on("connection", socket => this.connection(socket));

        this.flush(true)
        setInterval(() => this.flush(), 60000);
    }

    flush(authed?: boolean) {
        this.server.db.getRepository(GatewayConnection).find({
            where: {authed: !!authed ? true : Not(true)},
            select: ["guid"]
        }).then(gates => {
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
            if (!authed) {
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
            if (session) {
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
                                        gate.authed = true;
                                        this.server.db.getRepository(GatewayConnection).save(gate).then(gat3 => {
                                            session = new GatewaySession(socket, gat3, this);
                                            this.sessions.set(gat3.guid, session);
                                            authed = true;
                                            session.message(GatewayMessageTypes.Authenticated);
                                        });
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
                    if ("type" in msg) {
                        let respond: {
                            type: "results" | "unknown"
                            errors?: GraphQLError[],
                            qid?: any,
                            data?: any
                        } = {type: "unknown"}
                        if (msg.type === "query" && "query" in msg && typeof msg.query === "string") {
                            respond.type = "results";
                            let doc, worked = true;
                            try {
                                doc = parse(new Source(msg.query, "Gateway request"))
                            } catch (syntaxError: unknown) {
                                respond.errors = [syntaxError as GraphQLError];
                                if ("qid" in msg) {
                                    respond.qid = msg.qid;
                                }
                                worked = false;
                            }
                            if (worked && !!doc) {
                                execute({
                                    schema: this.schema,
                                    document: doc,
                                    variableValues: "variables" in msg ? msg.variables : undefined,
                                    operationName: "operationName" in msg ? msg.operationName : undefined,
                                    contextValue: msg,
                                });
                            }
                        }

                        if (respond.type !== "unknown") {
                            socket.send(JSON.stringify(respond));
                        }
                    }
                }
            }
        })
    }
}

export enum GatewayErrors {
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
