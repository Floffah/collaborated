import { createClient, RedisClient } from "redis";
import Server from "../web/Server";
import Slave from "./Slave";

export class Interprocess {
    sub: RedisClient;
    pub: RedisClient;

    server: Server;

    master = false;

    slaves: Map<string, Slave> = new Map();

    constructor(server: Server) {
        this.server = server;
    }

    init(done?: () => void) {
        if (this.server.cfg.val.redis.host === "example.com") return;
        this.server.logger.info("Connecting to Redis server...");
        this.sub = createClient({
            host: this.server.cfg.val.redis.host,
            port: this.server.cfg.val.redis.port,
            password: this.server.cfg.val.redis.password,
            url: this.server.cfg.val.redis.url,
        });

        let sub1 = false,
            sub2 = false;

        this.sub.on("ready", () => {
            if (!sub1) {
                sub1 = true;
                this.pub = createClient({
                    host: this.server.cfg.val.redis.host,
                    port: this.server.cfg.val.redis.port,
                    password: this.server.cfg.val.redis.password,
                    url: this.server.cfg.val.redis.url,
                });
                this.pub.on("ready", () => {
                    if (!sub2) {
                        sub2 = true;
                        this.server.logger.info("Connected to Redis server");
                        if (
                            this.server.cfg.val.environment.ipmode === "master"
                        ) {
                            this.master = true;
                            this.sub.subscribe("capp:master", () =>
                                this.ipmoded(done),
                            );
                        } else {
                            this.sub.subscribe("capp:slave", () =>
                                this.ipmoded(done),
                            );
                        }
                        this.sub.on("message", (channel, msg) =>
                            this.message(channel, msg),
                        );
                    }
                });
            }
        });
    }

    message(channel: string, msg: string) {
        let chnl = 0;
        if (channel === "capp:master") {
            chnl = ChannelType.Master;
        } else if (channel === "capp:slave") {
            chnl = ChannelType.Slave;
        }
        const dat = JSON.parse(msg);
        const message = dat.msg;
        const data = dat.data;

        if (chnl === ChannelType.Master) {
            if (message === MessageType.SlaveAvailable) {
                const slave = new Slave();
                slave.name = data.name;
                this.slaves.set(slave.name, slave);
            }
        }

        console.log(chnl, message, data);
    }

    send(
        channel: ChannelType,
        msg: MessageType,
        data?: { [k: string]: any },
    ): Promise<void> {
        if (channel === ChannelType.Master) {
            return this._send("capp:master", msg, data);
        } else if (channel === ChannelType.Slave) {
            return this._send("capp:slave", msg, data);
        }
        return Promise.resolve();
    }

    _send(
        channel: string,
        msg: MessageType,
        data?: { [k: string]: any },
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pub.publish(
                channel,
                JSON.stringify({
                    msg,
                    data,
                }),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    }

    ipmoded(done?: () => void) {
        if (this.master) {
            this.send(ChannelType.Slave, MessageType.WhoAvailable);
        }
        this.server.logger.info(
            `Subscribed to ${this.server.cfg.val.environment.ipmode} ipmode on redis server`,
        );
        if (done) done();
    }
}

enum ChannelType {
    Master,
    Slave,
}

enum MessageType {
    WhoAvailable,
    SlaveAvailable,
}
