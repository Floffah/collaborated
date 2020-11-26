import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";
import API from "./API";
import Logger from "../util/Logger";
import {Connection, createConnection} from "typeorm";
import {GatewayConnection, User} from "../db/Models";

export default class Server {
    app: Application
    server: HTTPServer
    api: API
    logger: Logger = new Logger();
    db: Connection

    init() {
        this.logger.info("Connecting to database...");
        createConnection({
            type: "postgres",
            host: "ec2-176-34-114-78.eu-west-1.compute.amazonaws.com",
            database: "d9vius48l50fp2",
            username: "mkqrnsuqoxkcgt",
            port: 5432,
            password: "2eb132ed200c9a3990636f50d7b8b786be16680cdfe15461b93e41b7c6bb5dc8",
            url: "postgres://mkqrnsuqoxkcgt:2eb132ed200c9a3990636f50d7b8b786be16680cdfe15461b93e41b7c6bb5dc8@ec2-176-34-114-78.eu-west-1.compute.amazonaws.com:5432/d9vius48l50fp2",

            entities: [User, GatewayConnection],
            entityPrefix: "capp_",
            synchronize: true,
            logging: process.env.mode === "dev" ? "all" : ["error", "warn", "migration"],
            logger: "advanced-console",

            ssl: {
                requestCert: true,
                rejectUnauthorized: process.env.mode !== "dev",
            }
        }).then(c => {
            this.logger.info(`Database connection made. (insecure ssl ${process.env.mode === "dev" ? "on" : "off"})`)
            this.db = c;
            this.start();
        });
    }

    start() {
        this.logger.info("Starting...");

        this.app = express();
        this.server = createServer(this.app);

        if (!process.argv.includes("--dev")) {
            this.app.use(staticCached(resolve(__dirname, "../../../web/build"), this.logger));
        }

        if(!process.argv.includes("--disable-api")) {
            this.api = new API(this);
            this.api.init();
        }

        this.server.listen(80);
        this.logger.info("Started on port 80");
    }
}
