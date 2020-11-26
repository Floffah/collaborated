import { Application, Router } from "express";
import { graphqlHTTP } from "express-graphql";
import query from "./schema/query";
import {Server as WSServer} from "ws"
import Server from "./Server";

export default class API {
    server: Server
    route: Router
    ws: WSServer

    constructor(server: Server) {
        this.server = server;
    }

    init() {
        this.route = Router()
        this.server.app.use("/api/v1", this.route);
        this.route.use("/", graphqlHTTP({
            schema: query(this),
            graphiql: true
        }));
        
        this.ws = new WSServer(this.server.server)
    }
}