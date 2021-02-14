import WSSocket, { Data } from "ws";
import { Client } from "../core/Client";
import chalk from "chalk";
import ProjectStore from "../store/ProjectStore";
import { createGraphQLError, GraphQLToError } from "../util/errors";
import {
    GatewayClientMessageTypes,
    GatewayServerMessageTypes,
    IncomingMessage,
    OutgoingMessage,
    OutgoingQueryMessageData,
} from "@collaborated/common";

export class SocketManager {
    ws?: WSSocket;
    bws?: WebSocket;
    guid: number;

    #access: string;

    client: Client;

    lqid = 0;
    qidfs: Map<number, (msg: any) => void> = new Map();

    constructor(url: string, guid: number, access: string, client: Client) {
        this.client = client;
        this.#access = access;
        this.guid = guid;
        if (this.client.opts.browserMode) {
            this.bws = new WebSocket(url);

            this.bws.addEventListener("open", () => this.connected());
            this.bws.addEventListener("message", (e) => this.message(e.data));
            this.bws.addEventListener("close", () => this.closed());
        } else {
            this.ws = new WSSocket(url);

            this.ws.on("open", () => this.connected());
            this.ws.on("message", (data) => this.message(data));
            this.ws.on("close", () => this.closed());
        }
    }

    closed() {
        console.log(chalk`{red Websocket connection was abruptly closed}`);
        process.exit();
    }

    _gateQuery(
        query: string,
        variables?: { [k: string]: any },
    ): Promise<{ data: any }> {
        return new Promise((resolve, reject) => {
            const qid = this.lqid + 1;
            const start = Date.now();
            if (this.client.opts.debug) {
                console.log(
                    chalk`{red -} {blue GATEWAY MESSAGE WITH QUERY} {gray "${query}"} ${
                        variables
                            ? chalk`{blue WITH VARIABLES} {gray ${JSON.stringify(
                                  variables,
                              )}}`
                            : ""
                    } {blue WITH QID ${qid}}`,
                );
            }
            this.sendMessage(GatewayClientMessageTypes.Query, {
                query,
                variables,
                qid,
            } as OutgoingQueryMessageData).then(() => {
                this.qidfs.set(qid, (msg) => {
                    if ("errors" in msg) {
                        reject(GraphQLToError(createGraphQLError(msg, query)));
                    } else if ("data" in msg) {
                        let data = msg.data;
                        if (typeof msg !== "object") {
                            data = JSON.stringify(msg);
                        }
                        if (this.client.opts.debug) {
                            console.log(
                                chalk`{green -} {blue GATEWAY MESSAGE QUERY RETURN} {gray ${JSON.stringify(
                                    data,
                                )}} {blue WITH QID ${qid} IN ${
                                    Date.now() - start
                                }ms}`,
                            );
                        }
                        resolve({ data });
                    }
                });
                this.lqid = qid;
            });
        });
    }

    connected() {
        this.sendMessage(GatewayClientMessageTypes.Authenticate, {
            guid: this.guid,
            access: this.#access,
        });
    }

    message(data: Data) {
        if (typeof data === "string") {
            const dat: IncomingMessage = JSON.parse(data);
            if ("type" in dat) {
                if (dat.type === "message") {
                    if (
                        dat.messageid == GatewayServerMessageTypes.Authenticated
                    ) {
                        this.client.projects = new ProjectStore(this.client);
                        this.client.emit("ready");
                    } else if (
                        dat.messageid === GatewayServerMessageTypes.Results
                    ) {
                        if ("qid" in dat.data && this.qidfs.has(dat.data.qid)) {
                            (this.qidfs.get(dat.data.qid) as (
                                msg: any,
                            ) => void)(dat);
                        }
                    }
                }
            }
        }
    }

    sendMessage(
        msg: GatewayClientMessageTypes,
        data: { [k: string]: any },
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const smsg = JSON.stringify({
                type: msg,
                data,
            } as OutgoingMessage);
            if (this.client.opts.browserMode) {
                this.bws?.send(smsg);
            } else {
                this.ws?.send(smsg, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }
}
