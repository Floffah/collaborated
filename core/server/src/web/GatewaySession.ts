import WebSocket from "ws";
import {GatewayConnection} from "../db/Clients";
import API, {isJson} from "./API";
import {GatewayErrors, GatewayServerMessageTypes, ServerResponse} from "@collaborated/common";
import {execute, ExecutionResult, GraphQLError, parse, Source, validate} from "graphql";

export default class GatewaySession {
    socket: WebSocket
    gate: GatewayConnection
    api: API
    access: string

    authed: boolean = false;

    // constructor(socket: WebSocket, gate: GatewayConnection, api: API, access: string) {
    //     this.socket = socket;
    //     this.gate = gate;
    //     this.api = api;
    //     this.access = access;
    // }

    constructor(socket: WebSocket, api: API) {
        this.socket = socket;
        this.api = api;

        this.socket.on("close", () => this.onClose());
        this.socket.on("message", (data) => this.onMessage(<string>data));
    }

    onConnect() {
        setTimeout(() => {
            if (!this.authed) {
                this.socket.send(JSON.stringify({
                    type: "error",
                    error: GatewayErrors.AuthenticationTimeOut,
                    errorName: GatewayErrors[GatewayErrors.AuthenticationTimeOut]
                }), () => {
                    this.socket.close();
                });
            }
        }, 10000);
    }

    onClose() {
        if(this.gate) {
            this.rid();
        }
    }

    onMessage(data:string) {
        console.log(data);
        if (isJson(data)) {
            let msg = JSON.parse(data);
            if (!this.authed) {
                // authenticating
                if ("type" in msg && msg.type === "auth" && "guid" in msg && "access" in msg) {
                    this.api.server.db.getRepository(GatewayConnection).findOne({
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
                                    this.api.server.db.getRepository(GatewayConnection).save(gate).then(gat3 => {
                                        this.api.sessions.set(gat3.guid, this);
                                        this.gate = gat3;
                                        this.authed = true;
                                        this.sendMessage(GatewayServerMessageTypes.Authenticated);
                                    });
                                } else {
                                    this.sendError(GatewayErrors.AuthDetailMismatch).then(() => this.socket.close());
                                }
                            } else {
                                this.sendError(GatewayErrors.CouldNotFetchUser).then(() => this.socket.close());
                            }
                        } else {
                            this.sendError(GatewayErrors.IncorrectAuthDetails).then(() => this.socket.close());
                        }
                    });
                } else {
                    this.sendError(GatewayErrors.InvalidAuthDetails).then(() => this.socket.close());
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
                                let errs = validate(this.api.schema, doc);
                                if (errs.length > 0) {
                                    respond.errors = <GraphQLError[]>errs;
                                    respond.salvageable = true;
                                }
                                (execute({
                                    schema: this.api.schema,
                                    document: doc,
                                    variableValues: "variables" in msg ? msg.variables : undefined,
                                    operationName: "operationName" in msg ? msg.operationName : undefined,
                                    contextValue: {access: this.access},
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
                        this.socket.send(JSON.stringify(respond));
                    });
                }
            }
        }
    }

    sendMessage(type: GatewayServerMessageTypes, data?: any) {
        this.socket.send(JSON.stringify({
            type: "message",
            message: GatewayServerMessageTypes[type],
            messageid: type,
            data
        }));
    }

    sendError(type: GatewayErrors): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.send(JSON.stringify({
                type: "error",
                error: type,
                errorName: GatewayErrors[type]
            }), (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    rid() {
        let guid = this.gate.guid;
        this.api.server.db.getRepository(GatewayConnection).delete(this.gate).then(() => {
            this.api.sessions.delete(guid);
        });
    }
}
