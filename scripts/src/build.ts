// https://gist.github.com/Floffah/9f0414f1bd3a6df9702bc7d4681074fb

import { spawn } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";

const paths: string[] = [];
const rt = resolve(__dirname, "../../packages");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rtp = require("../../package.json");

for (const path of readdirSync(rt)) {
    let topush = "";
    if (
        !process.argv.includes("-t") &&
        existsSync(resolve(rt, path, "snowpack.config.js"))
    ) {
        topush = "2@" + path;
    } else if (
        existsSync(resolve(rt, path, "tsconfig.json")) &&
        process.argv.includes("-t") &&
        !existsSync(resolve(rt, path, "snowpack.config.js"))
    ) {
        topush = "1@" + path;
    }

    if (Object.prototype.hasOwnProperty.call(rtp, "buildOrder")) {
        if (rtp.buildOrder.includes(path)) {
            paths[rtp.buildOrder.indexOf(path)] = topush;
        } else {
            paths.push(topush);
        }
    } else {
        paths.push(topush);
    }
}

if (process.argv.includes("--dev") || process.argv.includes("-d")) {
    if (process.platform === "win32") {
        let cmd = "wt ";

        for (const path of paths) {
            const name = path.replace(/[0-9]+@/, "");
            let start = false;
            let pkg: { [k: string]: any } = {};
            if (existsSync(resolve(rt, name, "package.json"))) {
                pkg = JSON.parse(
                    readFileSync(resolve(rt, name, "package.json"), "utf-8"),
                );
                start = "scripts" in pkg && "start" in pkg.scripts;
            }

            if (path.startsWith("1@")) {
                cmd += `new-tab --title @${rtp.name}/${name}_build --startingDirectory ./ yarn.cmd workspace @${rtp.name}/${name} tsc -w; `;
                if (start) {
                    cmd += `new-tab --title @${rtp.name}/${name}_start --startingDirectory ./ yarn.cmd workspace @${rtp.name}/${name} start --dev; `;
                }
            } else if (path.startsWith("2@")) {
                cmd += `new-tab --title @${rtp.name}/${name}_snowpack --startingDirectory ./ yarn.cmd workspace @${rtp.name}/${name} snowpack dev; `;
                cmd += `new-tab --title @${rtp.name}/${name}_storybook --startingDirectory ./ yarn.cmd workspace @${rtp.name}/${name} start-storybook -p 6006; `;
            }
        }

        const cmd2 = cmd.replace(/; $/, "").split(" ");

        spawn(<string>cmd2.shift(), cmd2, {
            stdio:
                process.argv.includes("--verbose") ||
                process.argv.includes("-v")
                    ? "inherit"
                    : undefined,
            cwd: resolve(__dirname, "../../"),
        }).on("close", (code) => {
            process.exit(code);
        });
    }
} else {
    nextBuild(0);
}

function nextBuild(i: number) {
    if (paths[i] !== undefined) {
        let cmd: string[] = [];
        const yarn = process.platform === "win32" ? "yarn.cmd" : "yarn";
        const path = paths[i];
        const name = path.replace(/[0-9]+@/, "");
        console.log(chalk`{green.underline building @${rtp.name}/${name}}`);
        if (path.startsWith("1@")) {
            cmd = `${yarn} workspace @${rtp.name}/${name} tsc`.split(" ");
        } else if (path.startsWith("2@")) {
            cmd = `${yarn} workspace @${rtp.name}/${name} snowpack build && ${yarn} workspace @${rtp.name}/${name} docs`.split(
                " ",
            );
        } else {
            nextBuild(i + 1);
            return;
        }
        console.log(chalk`{gray $ "${cmd.join(" ")}"}`);

        spawn(<string>cmd.shift(), cmd, {
            stdio:
                process.argv.includes("--verbose") ||
                process.argv.includes("-v")
                    ? "inherit"
                    : undefined,
            cwd: resolve(__dirname, "../../"),
        }).on("close", (code) => {
            if (code !== 0) {
                process.exit(code);
            } else {
                nextBuild(i + 1);
            }
        });
    }
}
