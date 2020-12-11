import express, {Application} from "express";
import {createServer, Server as HTTPServer} from "http";
import {staticCached} from "./middlewares";
import {resolve} from "path";
import API from "./API";
import Logger from "../util/Logger";
import {Connection} from "typeorm";
import {Interprocess} from "../comms/Interprocess";
import Configuration from "../util/Configuration";
import {existsSync, mkdirSync} from "fs";
import DatabaseManager from "../db/DatabaseManager";
import {terminal, Terminal} from "terminal-kit";
import {createInterface} from "readline";

export default class Server {
    app: Application
    server: HTTPServer
    api: API
    logger: Logger = new Logger();
    db: Connection
    ip: Interprocess
    cfg: Configuration
    dbm: DatabaseManager
    term: Terminal = terminal

    init() {
        if (!existsSync(resolve(__dirname, "../../data"))) {
            mkdirSync(resolve(__dirname, "../../data"));
        }

        this.cfg = new Configuration(resolve(__dirname, "../../data"));

        this.term.on("key", (n: string, m: any[], d: { isCharacter: boolean; codepoint: number; code: number | Buffer; }) => this.key(n, m, d))
        this.cliutil();
        this.term.grabInput(false);

        this.dbm = new DatabaseManager(this);
        this.dbm.init().then(() => {
            this.logger.info(`Database initialized.`)
            this.logger.warn("Collaborated instance running in dev mode. THIS IS NOT SECURE. SWITCH TO PRODUCTION MODE BEFORE DEPLOYING.")
            this.start()
        });
    }

    cliutil() {
        let r = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        r.on("SIGINT", () => this.shutdown());
        process.on("SIGINT", () => this.shutdown());
    }

    shutdown() {
        this.logger.warn("Shutting down...");
        this.api.stop().then(() => {
            this.server.close(() => {
                this.dbm.stop().then(() => {
                    process.exit();
                });
            });
        });
    }

    key(name: string, match: any[], dat: { isCharacter: boolean, codepoint: number, code: number | Buffer }) {
        console.log(name, match, dat);
        if(name === "CTRL_C") {
            this.shutdown()
        }
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
