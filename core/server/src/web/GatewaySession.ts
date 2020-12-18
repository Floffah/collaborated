import WebSocket from "ws";
import {GatewayConnection} from "../db/Clients";
import API from "./API";
import {GatewayServerMessageTypes} from "@collaborated/common/src/types/APITypes";

export default class GatewaySession {
    socket: WebSocket
    gate: GatewayConnection
    api: API
    access: string

    constructor(socket: WebSocket, gate: GatewayConnection, api: API, access: string) {
        this.socket = socket;
        this.gate = gate;
        this.api = api;
        this.access = access;
    }

    message(type: GatewayServerMessageTypes, data?: any) {
        this.socket.send(JSON.stringify({
            type: "message",
            message: GatewayServerMessageTypes[type],
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
