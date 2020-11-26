import WebSocket from "ws";
import {GatewayConnection} from "../db/Models";

export default class GatewaySession {
    socket: WebSocket
    gate: GatewayConnection

    constructor(socket: WebSocket, gate: GatewayConnection) {
        this.socket = socket;
        this.gate = gate;
    }
}
