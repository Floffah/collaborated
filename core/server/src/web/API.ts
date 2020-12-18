import {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import query from "./schema/query";
import WebSocket, {Server as WSServer} from "ws"
import Server from "./Server";
import GatewaySession from "./GatewaySession";
import {GatewayConnection} from "../db/Clients";
import {Not} from "typeorm";
import {forWait} from "../util/arrays";
import EventPush from "./EventPush";
import {execute, ExecutionResult, GraphQLError, GraphQLSchema, parse, Source, validate} from "graphql";
import cors from "cors";
import {RequestLog} from "../db/Utils";
import {GatewayErrors, GatewayServerMessageTypes, ServerResponse} from "@collaborated/common/src/types/APITypes";

export default class API {
    server: Server
    route: Router
    ws: WSServer

    sessions: Map<number, GatewaySession> = new Map();

    events: EventPush

    schema: GraphQLSchema = query(this)

    flushint: number;

    constructor(server: Server) {
        this.server = server;
    }

    stop(): Promise<void> {
        clearInterval(this.flushint);
        return new Promise((resolve, reject) => {
            this.server.logger.info("Clearing sessions")
            for (let sesh of this.sessions.keys()) {
                let session = <GatewaySession>this.sessions.get(sesh);
                session.message(GatewayServerMessageTypes.Shutdown);
                session.socket.close();
            }
            this.flush(true);
            this.ws.close((err) => {
                if (!!err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    }

    init() {
        this.route = Router()
        this.server.app.use("/api/v1", this.route);

        this.route.use((req, _res, next) => {
            next();
            let origin = req.get("host") || req.get("origin") || null
            if (!!origin) {
                this.server.db.getRepository<RequestLog>(RequestLog).findOne({origin: origin}).then(reqs2 => {
                    let reqs = new RequestLog();
                    reqs.system = "api"
                    let origin = req.get("host") || req.get("origin") || null
                    reqs.origin = <string>origin;
                    reqs.amount = !!reqs2 ? reqs2.amount + 1 : 1
                    this.server.db.getRepository<RequestLog>(RequestLog).save(reqs);
                });
            }
        })
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
        this.flushint = setInterval(() => this.flush(), 60000);
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
                                            session = new GatewaySession(socket, gat3, this, gate.user.access);
                                            this.sessions.set(gat3.guid, session);
                                            authed = true;
                                            session.message(GatewayServerMessageTypes.Authenticated);
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
                        new Promise<ServerResponse>((resolve) => {
                            let respond: ServerResponse = {type: "unknown"}
                            if (msg.type === "query" && "query" in msg && typeof msg.query === "string") {
                                respond.type = "results";
                                let doc, worked = true;
                                try {
                                    doc = parse(new Source(msg.query, "Gateway request"))
                                } catch (syntaxError: unknown) {
                                    respond.errors = [syntaxError as GraphQLError];
                                    respond.salvageable = true;
                                    worked = false;
                                }
                                if ("qid" in msg) {
                                    respond.qid = msg.qid;
                                }
                                if (worked && !!doc) {
                                    let errs = validate(this.schema, doc);
                                    if (errs.length > 0) {
                                        respond.errors = <GraphQLError[]>errs;
                                        respond.salvageable = true;
                                    }
                                    (execute({
                                        schema: this.schema,
                                        document: doc,
                                        variableValues: "variables" in msg ? msg.variables : undefined,
                                        operationName: "operationName" in msg ? msg.operationName : undefined,
                                        contextValue: {access: session.access},
                                    }) as Promise<ExecutionResult<{ [p: string]: any }, { [p: string]: any }>>).then((res) => {
                                        respond = {
                                            ...respond,
                                            ...res
                                        } as unknown as ServerResponse
                                        resolve(respond);
                                    });
                                } else {
                                    resolve(respond);
                                }
                            }
                        }).then((respond) => {
                            socket.send(JSON.stringify(respond));
                        });
                    }
                }
            }
        })
    }
}

function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
