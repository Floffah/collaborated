import { resolve } from "path";
import API from "./API";
import Logger from "../util/Logger";
import { Connection } from "typeorm";
import { Interprocess } from "../comms/Interprocess";
import Configuration from "../util/Configuration";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import DatabaseManager from "../db/DatabaseManager";
import { terminal, Terminal } from "terminal-kit";
import memwatch from "@floffah/node-memwatch";
import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCors from "fastify-cors";
import { clearTimeout } from "timers";

export default class Server {
    app: FastifyInstance & PromiseLike<any>;
    api: API;
    logger: Logger = new Logger();
    db: Connection;
    ip: Interprocess;
    cfg: Configuration;
    dbm: DatabaseManager;
    term: Terminal = terminal;
    hds: any[] = [];
    started = false;

    dev = false;
    maintenance = false;

    init() {
        this.hds[0] = new memwatch.HeapDiff();

        if (!existsSync(resolve(__dirname, "../../data"))) {
            mkdirSync(resolve(__dirname, "../../data"));
        }

        this.cfg = new Configuration(resolve(__dirname, "../../data"));
        if (
            process.argv.includes("--dev") ||
            this.cfg.val.environment.mode === "dev"
        ) {
            this.dev = true;
        }
        if (
            process.argv.includes("--maintenance") ||
            this.cfg.val.environment.maintenance === "true"
        ) {
            this.maintenance = true;
        }

        this.term.on(
            "key",
            (
                n: string,
                m: any[],
                d: {
                    isCharacter: boolean;
                    codepoint: number;
                    code: number | Buffer;
                },
            ) => this.key(n, m, d),
        );
        this.cliutil();
        this.term.grabInput(true);

        this.dbm = new DatabaseManager(this);
        this.dbm.init().then(() => {
            this.logger.info(`Database initialized.`);
            if (this.dev) {
                this.logger.warn(
                    "Collaborated instance running in dev mode. THIS IS NOT SECURE. SWITCH TO PRODUCTION MODE BEFORE DEPLOYING.",
                );
                if (this.maintenance) {
                    this.logger.fatal(
                        "Do not mix dev mode and maintenance mode.",
                    );
                    process.exit();
                }
            } else if (this.maintenance) {
                this.logger.err(
                    "WATCH OUT! The server is running in maintenance mode. Nothing will work as expected! Only use this when servers or dependencies are updating.",
                );
            }
            this.start();
        });
    }

    key(
        name: string,
        _match: any[],
        _dat: {
            isCharacter: boolean;
            codepoint: number;
            code: number | Buffer;
        },
    ) {
        if (name.toLowerCase() === "m") {
            this.doMemDiff();
        } else if (name === "CTRL_C") {
            this.shutdown();
        }
    }

    doMemDiff() {
        if (this.hds.length > 0) {
            this.logger.warn("Saving heap diff...");
            const diff = this.hds[0].end();
            writeFileSync(
                resolve(this.cfg.rootpath, "diff.json"),
                JSON.stringify(diff, null, 4),
                "utf8",
            );
            this.logger.warn(
                "Saved heap diff to " + resolve(this.cfg.rootpath, "diff.json"),
            );
        } else {
            this.logger.warn("Starting heap diff.");
            this.hds[0] = new memwatch.HeapDiff();
            this.logger.warn(
                "Started heap snapshot. Press M again to save the heap diff",
            );
        }
    }

    cliutil() {
        process.on("SIGINT", () => this.shutdown());
    }

    shutdown() {
        let success = false;
        const t = setTimeout(() => {
            if (!success) {
                this.logger.err("Forcefully exiting");
                process.exit();
            }
        }, 5000);
        this.logger.warn("Shutting down...");
        this.api.stop().then(() => {
            this.app.close(() => {
                this.dbm.stop().then(() => {
                    success = true;
                    clearTimeout(t);
                    process.exit();
                });
            });
        });
    }

    public async test(): Promise<string> {
        return "hi";
    }

    public async test2(): Promise<string> {
        return await this.test();
    }

    start() {
        this.logger.info("Starting...");

        this.ip = new Interprocess(this);
        this.ip.init(() => {
            this.app = fastify();

            this.app.register(fastifyCors, {
                credentials: true,
                origin: ["*"],
            });

            if (!this.dev) {
                this.app.register(fastifyStatic, {
                    root: resolve(__dirname, "../../../web/build"),
                    prefix: "/",
                });
            }

            if (!this.maintenance) {
                this.api = new API(this);
                this.api.init();
            }

            this.app.listen(80);

            const diff = this.hds[0].end();
            writeFileSync(
                resolve(this.cfg.rootpath, "startup.diff.json"),
                JSON.stringify(diff, null, 4),
                "utf8",
            );
            this.hds = [];
            this.started = true;

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
