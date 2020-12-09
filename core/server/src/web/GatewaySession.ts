import WebSocket from "ws";
import {GatewayConnection} from "../db/Clients";
import API from "./API";

export default class GatewaySession {
    socket: WebSocket
    gate: GatewayConnection
    api: API

    constructor(socket: WebSocket, gate: GatewayConnection, api: API) {
        this.socket = socket;
        this.gate = gate;
        this.api = api;
    }

    message(type: GatewayMessageTypes, data?: any) {
        this.socket.send(JSON.stringify({
            type: "message",
            message: GatewayMessageTypes[type],
            messageid: type,
            data
        }));
    }

    rid() {
        let guid = this.gate.guid;
        this.api.server.db.getRepository(GatewayConnection).delete(this.gate).then(() => {
            this.api.sessions.delete(guid);
        });
    }
}


export enum GatewayMessageTypes {
    Authenticated,
    Shutdown,
}
