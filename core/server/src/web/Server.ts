import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";

export default class Server {
    app: Application
    server: HTTPServer

    start() {
        this.app = express();
        this.server = createServer(this.app);

        if (!process.argv.includes("--dev")) {
            this.app.use(staticCached(resolve(__dirname, "../../../web/build")));
        }

        this.server.listen(80);
    }
}
