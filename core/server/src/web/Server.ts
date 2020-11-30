import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";
import API from "./API";
import Logger from "../util/Logger";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {GatewayConnection, User} from "../db/Models";
import {Interprocess} from "../comms/Interprocess";
//import {randomBytes} from "crypto";

export default class Server {
    app: Application
    server: HTTPServer
    api: API
    logger: Logger = new Logger();
    db: Connection
    ip: Interprocess

    init() {
        this.logger.info("Connecting to database...");
        createConnection({
            type: process.env.dbtype,
            host: process.env.dbhost,
            database: process.env.dbdatabase,
            username: process.env.dbusername,
            port: parseInt(<string>process.env.dbport),
            password: process.env.dbpassword,
            url: process.env.dburl,

            entities: [User, GatewayConnection],
            entityPrefix: "capp_",
            synchronize: true,
            logging: process.env.mode === "dev" ? "all" : ["error", "warn", "migration"],
            logger: "advanced-console",

            ssl: {
                requestCert: true,
                rejectUnauthorized: process.env.mode !== "dev",
            }
        } as ConnectionOptions).then(c => {
            this.logger.info(`Database connection made. (insecure ssl ${process.env.mode === "dev" ? "on" : "off"})`)
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

            if (!process.argv.includes("--dev")) {
                this.app.use(staticCached(resolve(__dirname, "../../../web/build"), this.logger));
            }

            if (!process.argv.includes("--disable-api")) {
                this.api = new API(this);
                this.api.init();
            }

            this.server.listen(80);
            this.logger.info("Started on port 80");

            // let admin = new User();
            // admin.id = 1;
            // admin.access = randomBytes(parseInt(<string>process.env.accesslength)/2).toString("hex");
            // admin.username = "floffah"
            // admin.email = "therealfloffah@gmail.com"
            // this.db.manager.save<User>(admin);
        });
    }
}
