import Server from "../web/Server";
import {Connection, createConnection} from "typeorm";
import {GatewayConnection, User} from "./Clients";
import {Group} from "./Groups";
import {Project} from "./Projects";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

export default class DatabaseManager {
    server: Server

    main: Connection

    constructor(server: Server) {
        this.server = server;
    }

    stop():Promise<any> {
        return this.main.close()
    }

    init(): Promise<void> {
        return new Promise(resolve => {
            this.mainConnection().then(db => {
                this.main = db;
                this.server.db = db;
                resolve();
            });
        });
    }

    private mainConnection() {
        return createConnection({
            type: this.server.cfg.val.database.type,
            host: this.server.cfg.val.database.host,
            database: this.server.cfg.val.database.database,
            username: this.server.cfg.val.database.username,
            port: this.server.cfg.val.database.port,
            password: this.server.cfg.val.database.password,
            //url: this.server.cfg.val.database.url,
            //url: `mongodb://${this.server.cfg.val.database.username}:${this.server.cfg.val.database.password}@${this.server.cfg.val.database.host}/${this.server.cfg.val.database.database}?retryWrites=true&w=majority`,

            entities: [User, GatewayConnection, Group, Project],
            entityPrefix: "capp_",
            synchronize: true,
            logging: this.server.cfg.val.environment.mode === "dev" ? "all" : ["error", "warn", "migration"],
            logger: "advanced-console",
            // ssl: true,
            // useUnifiedTopology: true,
            // useNewUrlParser: true,
            // w: "majority",
            // sslCert: readFileSync(resolve(this.server.cfg.rootpath, "crt.pem")),
            // sslKey: readFileSync(resolve(this.server.cfg.rootpath, "priv.pem")).toString("utf-8"),
            // authMechanism: "MONGODB-X509",
            ssl: {
                requestCert: true,
                rejectUnauthorized: this.server.cfg.val.environment.mode !== "dev",
                //cert: readFileSync(resolve(this.server.cfg.rootpath, "cert.pem")),
            }
        } as PostgresConnectionOptions)
    }
}
