import {Router} from "express";
import {graphqlHTTP} from "express-graphql";
import query from "./schema/query";
import WebSocket, {Server as WSServer} from "ws"
import Server from "./Server";
import GatewaySession from "./GatewaySession";
import {GatewayConnection} from "../db/Clients";
import {Not} from "typeorm";
import {forWait} from "../util/arrays";
import EventPush from "./EventPush";
import {GraphQLSchema} from "graphql";
import cors from "cors";
import {RequestLog} from "../db/Utils";
import {GatewayServerMessageTypes} from "@collaborated/common";
import Timeout = NodeJS.Timeout;

export default class API {
    server: Server
    route: Router
    ws: WSServer

    sessions: Map<number, GatewaySession> = new Map();

    events: EventPush

    schema: GraphQLSchema = query(this)

    flushint: Timeout;

    constructor(server: Server) {
        this.server = server;
    }

    stop(): Promise<void> {
        clearInterval(this.flushint);
        return new Promise((resolve, reject) => {
            this.server.logger.info("Clearing sessions")
            for (let sesh of this.sessions.keys()) {
                let session = <GatewaySession>this.sessions.get(sesh);
                session.sendMessage(GatewayServerMessageTypes.Shutdown);
                session.socket.close();
            }
            this.flush(true);
            this.ws.close((err) => {
                if (!!err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    }

    init() {
        this.route = Router()
        this.server.app.use("/api/v1", this.route);

        this.route.use(cors());
        this.route.use((req, res, next) => {
            let origin = req.get("host") || req.get("origin") || null;
            if (!!origin) {
                next();
                this.server.db.getRepository<RequestLog>(RequestLog).findOne({origin: origin}).then(reqs2 => {
                    let reqs = new RequestLog();
                    reqs.system = "api"
                    let origin = req.get("host") || req.get("origin") || null
                    reqs.origin = <string>origin;
                    reqs.amount = !!reqs2 ? reqs2.amount + 1 : 1
                    this.server.db.getRepository<RequestLog>(RequestLog).save(reqs);
                });
            } else {
                res.status(400).json({error: "Must send host or origin header."});
            }
        });

        this.route.use("/", graphqlHTTP({
            schema: this.schema,
            graphiql: true,
        }));
        this.server.logger.info("Built GraphQL schema");

        this.ws = new WSServer({
            server: this.server.server,
            path: "/api/v1/gateway",
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 16 * 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 16 * 1024
                },
                concurrencyLimit: 10,
                threshold: 1024
            }
        });
        this.events = new EventPush(this);
        this.ws.on("listening", () => {
            this.server.logger.info("Gateway websocket listening on path /api/v1/gateway");
        });
        this.ws.on("connection", socket => this.connection(socket));

        this.flush(true)
        this.flushint = setInterval(() => this.flush(), 60000);
    }

    flush(authed?: boolean) {
        this.server.db.getRepository(GatewayConnection).find({
            where: {authed: !!authed ? true : Not(true)},
            select: ["guid"]
        }).then(gates => {
            forWait(gates, (gate, next) => {
                this.server.db.manager.delete<GatewayConnection>(GatewayConnection, gate).then(() => {
                    next();
                })
            });
        });
    }

    connection(socket: WebSocket) {
        let session: GatewaySession = new GatewaySession(socket, this);
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
