import WebSocket, {Data} from "ws";

export class SocketManager {
    ws: WebSocket
    guid: number;

    #access: string;

    constructor(url: string, guid: number, access: string) {
        this.ws = new WebSocket(url);
        this.guid = guid;
        this.#access = access;

        this.ws.on("open", () => this.connected());
        this.ws.on("message", data => this.message(data))
    }

    connected() {
        this.sendMessage(MessageTypes.Authenticate, {
            guid: this.guid,
            access: this.#access
        });
    }

    message(data: Data) {
        console.log(data);
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
