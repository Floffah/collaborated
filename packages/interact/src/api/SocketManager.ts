import WebSocket, {Data} from "ws";
import {Client, GatewayMessageTypes, Incoming} from "../core/Client";

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
        return new Promise((resolve, _reject) => {
            let qid = this.lqid + 1
            this.sendMessage(MessageTypes.Query, {query, variables, qid}).then(() => {
                this.qidfs.set(qid, (msg) => {
                    let data = msg;
                    if (typeof msg !== "object") {
                        data = JSON.stringify(msg);
                    }
                    resolve({data});
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
                if (dat.type === "message") {
                    if (dat.messageid == GatewayMessageTypes.Authenticated) {
                        this.client.emit("ready");
                    } else if (dat.messageid == GatewayMessageTypes.Return) {
                        if ("qid" in dat && dat.qid in this.qidfs) {
                            (this.qidfs.get(dat.qid) as (msg: any) => void)(dat.data)
                        }
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
