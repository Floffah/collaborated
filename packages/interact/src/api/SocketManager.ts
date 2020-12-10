import WebSocket, {Data} from "ws";
import {Client, GatewayMessageTypes, Incoming} from "../core/Client";
import chalk from "chalk";
import Projects from "../store/Projects";
import {createGraphQLError, GraphQLToError} from "../util/errors";

export class SocketManager {
    ws: WebSocket
    guid: number;

    #access: string;

    client: Client;

    lqid = 0;
    qidfs: Map<number, (msg: any) => void> = new Map()

    constructor(url: string, guid: number, access: string, client: Client) {
        this.ws = new WebSocket(url);
        this.guid = guid;
        this.#access = access;
        this.client = client;

        this.ws.on("open", () => this.connected());
        this.ws.on("message", data => this.message(data))
    }

    _gateQuery(query: string, variables?: { [k: string]: any }): Promise<{ data: any }> {
        return new Promise((resolve, reject) => {
            let qid = this.lqid + 1
            let start = Date.now()
            if(this.client.opts.debug) {
                console.log(chalk`{blue GATEWAY MESSAGE WITH QUERY} {gray "${query}"} ${!!variables ? chalk`{blue WITH VARIABLES} {gray ${JSON.stringify(variables)}}` : ""} {blue WITH QID ${qid}}`);
            }
            this.sendMessage(MessageTypes.Query, {query, variables, qid}).then(() => {
                this.qidfs.set(qid, (msg) => {
                    if("errors" in msg) {
                        reject(GraphQLToError(createGraphQLError(msg, query)))
                    } else if("data" in msg) {
                        let data = msg.data;
                        if (typeof msg !== "object") {
                            data = JSON.stringify(msg);
                        }
                        if(this.client.opts.debug) {
                            console.log(chalk`{blue GATEWAY MESSAGE QUERY RETURN} {gray ${JSON.stringify(data)}} {blue WITH QID ${qid} IN ${Date.now() - start}ms}`);
                        }
                        resolve({data});
                    }
                });
                this.lqid = qid;
            });
        })
    }

    connected() {
        this.sendMessage(MessageTypes.Authenticate, {
            guid: this.guid,
            access: this.#access
        });
    }

    message(data: Data) {
        if (typeof data === "string") {
            let dat: Incoming = JSON.parse(data);
            if ("type" in dat) {
                console.log(JSON.stringify(dat));
                if (dat.type === "message") {
                    if (dat.messageid == GatewayMessageTypes.Authenticated) {
                        this.client.projects = new Projects(this.client);
                        this.client.emit("ready");
                    }
                } else if(dat.type === "results") {
                    if ("qid" in dat && this.qidfs.has(dat.qid)) {
                        (this.qidfs.get(dat.qid) as (msg: any) => void)(dat)
                    }
                }
            }
        }
    }

    sendMessage(msg: MessageTypes, data: { [k: string]: any }): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                type: msg,
                ...data,
            }), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

enum MessageTypes {
    Authenticate = "auth",
    Query = "query",
}
