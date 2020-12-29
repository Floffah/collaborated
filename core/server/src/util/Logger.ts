import { Console } from "console";
import chalk from "chalk";
import timestamp from "time-stamp";

export default class Logger {
    last: number;
    console: Console = new Console(process.stdout, process.stderr);

    constructor() {
        this.last = Date.now();
    }

    info(...messages: string[]) {
        this.log("info", messages);
    }

    warn(...messages: string[]) {
        this.log("warn", messages);
    }

    err(...messages: string[]) {
        this.log("error", messages);
    }

    fatal(...messages: string[]) {
        this.log("fatal", messages);
    }

    log(type: string, messages: string[]) {
        let sts: string;
        switch (type) {
            case "info":
                sts = chalk`{blue info}`;
                break;
            case "error":
                sts = chalk`{red error}`;
                break;
            case "fatal":
                sts = chalk`{red.bold FATAL}`;
                break;
            case "warn":
                sts = chalk`{yellow warn}`;
                break;
            default:
                sts = chalk`{blue info}`;
                break;
        }
        const newer = Date.now();
        const message = chalk`{blue ${timestamp("HH:mm.ss")}} ${sts} ${
            type === "error" || type === "fatal"
                ? chalk`{red ${messages.join(" ")}}`
                : `${messages.join(" ")}`
        } {cyan +${newer - this.last}ms}`;
        this.console.log(message);
        this.last = newer;
    }
}
