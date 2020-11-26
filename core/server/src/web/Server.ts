import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";
import API from "./API";

export default class Server {
    app: Application
    server: HTTPServer
    api: API

    start() {
        this.app = express();
        this.server = createServer(this.app);

        if (!process.argv.includes("--dev")) {
            this.app.use(staticCached(resolve(__dirname, "../../../web/build")));
        }

        if(!process.argv.includes("--disable-api")) {
            this.api = new API(this.app);
            this.api.init();
        }

        this.server.listen(80);
    }
}
