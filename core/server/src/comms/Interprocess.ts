import {createClient, RedisClient} from "redis";
import Server from "../web/Server";
import Slave from "./Slave";

export class Interprocess {
    sub: RedisClient
    pub: RedisClient

    server: Server

    master: boolean = false;

    slaves: Map<String, Slave> = new Map();

    constructor(server: Server) {
        this.server = server;
    }

    init(done?: () => void) {
        this.server.logger.info("Connecting to Redis server...");
        this.sub = createClient({
            host: process.env.rdhost,
            port: parseInt(<string>process.env.rdport),
            password: process.env.rdpassword,
            url: process.env.rdurl,
        });
        this.sub.on("ready", () => {
            this.pub = createClient({
                host: process.env.rdhost,
                port: parseInt(<string>process.env.rdport),
                password: process.env.rdpassword,
                url: process.env.rdurl,
            });
            this.pub.on("ready", () => {
                this.server.logger.info("Connected to Redis server");
                if (process.env.ipmode === "master") {
                    this.master = true;
                    this.sub.subscribe("capp:master", () => this.ipmoded(done))
                } else {
                    this.sub.subscribe("capp:slave",() => this.ipmoded(done));
                }
                this.sub.on("message", (channel, msg) => this.message(channel, msg));
            });
        });
    }

    message(channel: string, msg: string) {
        let chnl = 0;
        if(channel === "capp:master") {
            chnl = ChannelType.Master
        } else if(channel === "capp:slave") {
            chnl = ChannelType.Slave
        }
        let dat = JSON.parse(msg);
        let message = dat.msg;
        let data = dat.data;

        if(chnl === ChannelType.Master) {
            if(message === MessageType.SlaveAvailable) {
                let slave = new Slave();
                slave.name = data.name;
                this.slaves.set(slave.name, slave);
            }
        }

        console.log(chnl, message, data);
    }

    send(channel: ChannelType, msg: MessageType, data?: {[k: string]: any}): Promise<void> {
        if(channel === ChannelType.Master) {
            return this._send("capp:master", msg, data);
        } else if(channel === ChannelType.Slave) {
            return this._send("capp:slave", msg, data);
        }
        return Promise.resolve();
    }

    _send(channel: string, msg: MessageType, data?: {[k:string]: any}):Promise<void> {
        return new Promise((resolve, reject) => {
            this.pub.publish(channel, JSON.stringify({
                msg,
                data
            }), (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    ipmoded(done?: () => void) {
        if (this.master) {
            this.send(ChannelType.Slave, MessageType.WhoAvailable);
        }
        this.server.logger.info(`Subscribed to ${process.env.ipmode} ipmode on redis server`);
        if (done) done();
    }
}

enum ChannelType {
    Master,
    Slave
}

enum MessageType {
    WhoAvailable,
    SlaveAvailable
}
