import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";
import API from "./API";
import Logger from "../util/Logger";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {GatewayConnection, User} from "../db/Clients";
import {Interprocess} from "../comms/Interprocess";
import Configuration from "../util/Configuration";
import {existsSync, mkdirSync} from "fs";
import {Group} from "../db/Groups";
import {Project} from "../db/Projects";

export default class Server {
    app: Application
    server: HTTPServer
    api: API
    logger: Logger = new Logger();
    db: Connection
    ip: Interprocess
    cfg: Configuration

    init() {
        if(!existsSync(resolve(__dirname, "../../data"))) {
            mkdirSync(resolve(__dirname, "../../data"));
        }

        this.cfg = new Configuration(resolve(__dirname, "../../data"));

        this.logger.info("Connecting to database...");
        createConnection({
            type: this.cfg.val.database.type,
            host: this.cfg.val.database.host,
            database: this.cfg.val.database.database,
            username: this.cfg.val.database.username,
            port: this.cfg.val.database.port,
            password: this.cfg.val.database.password,
            url: this.cfg.val.database.url,

            entities: [User, GatewayConnection, Group, Project],
            entityPrefix: "capp_",
            synchronize: true,
            logging: this.cfg.val.environment.mode === "dev" ? "all" : ["error", "warn", "migration"],
            logger: "advanced-console",

            ssl: {
                requestCert: true,
                rejectUnauthorized: this.cfg.val.environment.mode !== "dev",
            }
        } as ConnectionOptions).then(c => {
            this.logger.info(`Database connection made. (insecure ssl ${this.cfg.val.environment.mode === "dev" ? "on" : "off"})`)
            this.db = c;
            this.start();
        });
    }

    start() {
        this.logger.info("Starting...");

        this.ip = new Interprocess(this);
        this.ip.init(() => {
            this.app = express();
            this.server = createServer(this.app);

            if (!process.argv.includes("--dev") && !process.argv.includes("--maintenance")) {
                this.app.use(staticCached(resolve(__dirname, "../../../web/build"), this.logger));
            }

            if (!process.argv.includes("--disable-api") && !process.argv.includes("--maintenance")) {
                this.api = new API(this);
                this.api.init();
            }

            this.server.listen(80);
            this.logger.info("Started on port 80");

            // let admin = new User();
            // admin.id = 1;
            // admin.access = randomBytes(this.cfg.val.info.accesslength/2).toString("hex");
            // admin.username = "floffah"
            // admin.email = "therealfloffah@gmail.com"
            // admin.password = "testpass123"
            // this.db.manager.save<User>(admin);
        });
    }
}
