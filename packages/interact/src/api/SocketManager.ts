import WebSocket, {Data} from "ws";
import {Client, GatewayMessageTypes, Incoming, isJson} from "../core/Client";

export class SocketManager {
    ws: WebSocket
    guid: number;

    #access: string;

    client: Client;

    qid = 0
    qs: ((msg: string) => void)[] = []

    constructor(url: string, guid: number, access: string, client: Client) {
        this.ws = new WebSocket(url);
        this.guid = guid;
        this.#access = access;
        this.client = client;

        this.ws.on("open", () => this.connected());
        this.ws.on("message", data => this.message(data))
    }

    connected() {
        this.sendMessage(MessageTypes.Authenticate, {
            guid: this.guid,
            access: this.#access
        });
    }

    _gateQuery(query: string, variables?: { [k: string]: any }) {
        return new Promise((resolve, reject) => {
            let qid = this.qid + 1;
            this.qid = qid;
            this.ws.send(JSON.stringify({query, variables, qid}));
            this.qs.push(umsg => {
                if(isJson(umsg)) {
                    let msg = JSON.parse(umsg);
                    if("type" in msg && msg.type === "results") {

                    }
                }
            });
        });
    }

    message(data: Data) {
        if(typeof data === "string") {
            let dat:Incoming = JSON.parse(data);
            if("type" in dat) {
                if(dat.type === "message") {
                    if(dat.messageid == GatewayMessageTypes.Authenticated) {
                        this.client.emit("ready");
                    }
                }
            }
        }
    }

    sendMessage(msg: MessageTypes, data: {[k: string]: any}): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                type:msg,
                ...data,
            }), err => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

enum MessageTypes {
    Authenticate = "auth"
}
