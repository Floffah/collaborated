import WebSocket from "ws";
import {GatewayConnection} from "../db/Clients";
import API, {isJson} from "./API";
import {
    GatewayClientMessageTypes,
    GatewayErrors,
    GatewayServerMessageTypes,
    IncomingErrorMessage,
    IncomingMessage,
    IncomingQueryMessageData,
    OutgoingMessage
} from "@collaborated/common";
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

        this.socket.on("close", () => this.onClose());
        this.socket.on("message", (data) => this.onMessage(<string>data));
    }

    onClose() {
        if (this.gate) {
            this.rid();
        }
    }

    onMessage(data: string) {
        if (isJson(data)) {
            let msg: OutgoingMessage = JSON.parse(data);
            if (!this.authed) {
                if (typeof msg.type === "string" && msg.type === GatewayClientMessageTypes.Authenticate && typeof msg.data.guid === "number" && typeof msg.data.access === "string") {
                    this.api.server.db.getRepository(GatewayConnection).findOne({
                        guid: msg.data.guid
                    }, {
                        loadEagerRelations: true,
                        relations: ["user"]
                    }).then((gate) => {
                        if (!!gate) {
                            if (!!gate.user && !!gate.user.id) { // @ts-ignore
                                if (gate.user.access === msg.data.access) {
                                    gate.authed = true;
                                    this.api.server.db.getRepository(GatewayConnection).save(gate).then(gat3 => {
                                        this.api.sessions.set(gat3.guid, this);
                                        this.gate = gat3;
                                        this.authed = true;
                                        this.access = gat3.user.access;
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
                if (typeof msg.type === "string") {
                    new Promise<IncomingQueryMessageData>((resolve) => {
                        let respond: IncomingQueryMessageData = {} as unknown as IncomingQueryMessageData
                        if (msg.type === "query" && typeof msg.data.query === "string") {
                            respond.type = "results";
                            let doc, worked = true;
                            try {
                                doc = parse(new Source(msg.data.query, "Gateway request"))
                            } catch (syntaxError: unknown) {
                                respond.errors = [syntaxError as GraphQLError];
                                respond.salvageable = true;
                                worked = false;
                            }
                            if (typeof msg.data.qid === "number") {
                                respond.qid = msg.data.qid;
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
                                    variableValues: "variables" in msg.data ? msg.data.variables : undefined,
                                    operationName: "operationName" in msg.data ? msg.data.operationName : undefined,
                                    contextValue: {access: this.access},
                                }) as Promise<ExecutionResult<{ [p: string]: any }, { [p: string]: any }>>).then((res) => {
                                    respond = {
                                        ...respond,
                                        ...res
                                    } as unknown as IncomingQueryMessageData
                                    resolve(respond);
                                });
                            } else {
                                resolve(respond);
                            }
                        }
                    }).then((respond) => {
                        this.sendMessage(GatewayServerMessageTypes.Results, respond);
                    });
                }
            }
        }
    }

    sendMessage(type: GatewayServerMessageTypes, data?: any):Promise<void> {
        return new Promise((resolve, reject) => {
            let msg = JSON.stringify({
                type: "message",
                message: GatewayServerMessageTypes[type],
                messageid: type,
                data
            } as IncomingMessage);
            this.socket.send(msg, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    sendError(type: GatewayErrors): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.send(JSON.stringify({
                type: "error",
                error: type,
                errorName: GatewayErrors[type]
            } as IncomingErrorMessage), (err) => {
                if (err) {
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
