import {parse, stringify} from "ini";
import {existsSync, readFileSync, writeFileSync} from "fs";
import {resolve} from "path";

export default class Configuration {
    rootpath: string

    val: Config

    constructor(rootpath: string) {
        this.rootpath = rootpath;
        this.read()
    }

    read() {
        if(!existsSync(resolve(this.rootpath, "config.ini"))) {
            this.defaults();
        }
        this.val = <Config>parse(readFileSync(resolve(this.rootpath, "config.ini"), "utf8"))
    }

    write() {
        writeFileSync(resolve(this.rootpath, "config.ini"), stringify(this.val));
    }

    defaults() {
        this.val = {
            environment: {
                mode: "dev",
                ipmode: "master",
                ipname: "master_1"
            },
            info: {
                accesslength: 512
            },
            database: {
                type: "mongodb",
                host: "example.com",
                database: "example",
                username: "example_user",
                port: 5432,
                password: "example password",
            },
            redis: {
                host: "example.com",
                user: "null",
                port: 29269,
                password: "example password",
            }
        }
        this.write();
    }
}

interface Config {
    environment: {
        mode: "dev"|"prod",
        ipmode: "master"|"slave",
        ipname: string,
    },
    info: {
        accesslength: number
    },
    database: {
        type: "postgres"|"mongodb",
        host: string,
        database: string,
        username: string,
        port: number,
        password: string,
        url?: string
    },
    redis: {
        host: string,
        user: string,
        port: number,
        password: string,
        url?: string
    }
}
