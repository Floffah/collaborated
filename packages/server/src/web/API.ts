import query from "./schema/query";
import WebSocket, { Server as WSServer } from "ws";
import Server from "./Server";
import GatewaySession from "./GatewaySession";
import { GatewayConnection } from "../db/Clients";
import { Not } from "typeorm";
import EventPush from "./EventPush";
import { GraphQLSchema } from "graphql";
import { GatewayServerMessageTypes } from "@collaborated/common";
import mercurius from "mercurius";
import Timeout = NodeJS.Timeout;

export default class API {
    server: Server;
    ws: WSServer;

    sessions: Map<number, GatewaySession> = new Map();

    events: EventPush;

    schema: GraphQLSchema = query(this);

    flushint: Timeout;

    constructor(server: Server) {
        this.server = server;
    }

    stop(): Promise<void> {
        clearInterval(this.flushint);
        return new Promise((resolve, reject) => {
            this.server.logger.info("Clearing sessions");
            for (const sesh of this.sessions.keys()) {
                const session = <GatewaySession>this.sessions.get(sesh);
                session.sendMessage(GatewayServerMessageTypes.Shutdown);
                session.socket.close();
            }
            this.flush(true);
            this.ws.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async init() {
        // this.server.app.use((req, res, next) => {
        //     const origin = req.get("host") || req.get("origin") || null;
        //     if (origin) {
        //         next();
        //         this.server.db
        //             .getRepository<RequestLog>(RequestLog)
        //             .findOne({ origin: origin })
        //             .then((reqs2) => {
        //                 const reqs = new RequestLog();
        //                 reqs.system = "api";
        //                 const origin =
        //                     req.get("host") || req.get("origin") || null;
        //                 reqs.origin = <string>origin;
        //                 reqs.amount = reqs2 ? reqs2.amount + 1 : 1;
        //                 this.server.db
        //                     .getRepository<RequestLog>(RequestLog)
        //                     .save(reqs);
        //             });
        //     } else {
        //         res.status(400).json({
        //             error: "Must send host or origin header.",
        //         });
        //     }
        // });

        this.server.app.register(mercurius, {
            schema: this.schema,
            prefix: "/api/v1",
            graphiql: "playground",
            path: "/",
        });
        this.server.logger.info("Built GraphQL schema");

        this.ws = new WSServer({
            server: this.server.app.server,
            path: "/api/v1/gateway",
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 16 * 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 16 * 1024,
                },
                concurrencyLimit: 10,
                threshold: 1024,
            },
        });
        this.events = new EventPush(this);
        this.ws.on("listening", () => {
            this.server.logger.info(
                "Gateway websocket listening on path /api/v1/gateway",
            );
        });
        this.ws.on("connection", (socket) => this.connection(socket));

        this.flush(true);
        this.flushint = setInterval(() => this.flush(), 60000);
    }

    async flush(authed?: boolean) {
        const gates = await this.server.db
            .getRepository(GatewayConnection)
            .find({
                where: { authed: authed ? true : Not(true) },
                select: ["guid"],
            });
        for (const gate of gates) {
            await this.server.db.manager.delete<GatewayConnection>(
                GatewayConnection,
                gate,
            );
        }
    }

    connection(socket: WebSocket) {
        const session: GatewaySession = new GatewaySession(socket, this);
        session.onConnect();
    }
}

export function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
