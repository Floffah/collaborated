import Server from "./server/Server.js";
import debug from "debug";
import chalk from "chalk";

if (process.env.USE_DEBUG === "true") debug.enable("*");

console.log(chalk`{blue Go!}`);
const initial = Date.now();

(async () => {
    const server = new Server();
    await server.go();

    const startup = Date.now() - initial;
    let ms = `${startup}ms`;

    if (startup > 10000) ms = chalk`{red ${ms}}`;
    else if (startup > 5000) ms = chalk`{yellow ${ms}}`;
    else if (startup > 2000) ms = chalk`{magenta ${ms}}`;
    else ms = chalk`{green ${ms}}`;

    console.log(chalk`{blue Started in} ${ms}`);
})();
