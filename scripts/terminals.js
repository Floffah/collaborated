import { exec } from "child_process";
import * as path from "path";

let cmd = `wt `;
if (!process.argv.includes("--builds")) {
    cmd += `new-tab --startingDirectory "${path.resolve(
        __dirname,
        "../",
    )}" yarn.cmd workspace web snowpack dev; `;

    cmd += `new-tab --startingDirectory "${path.resolve(
        __dirname,
        "../",
    )}" yarn.cmd workspace web start-storybook -p 6006; `;
}
cmd += `new-tab --startingDirectory "${path.resolve(
    __dirname,
    "../",
)}" yarn.cmd workspace server tsc -w; `;

cmd += `new-tab --startingDirectory "${path.resolve(
    __dirname,
    "../",
)}" yarn.cmd workspace app tsc -w; `;

cmd += `new-tab --startingDirectory "${path.resolve(
    __dirname,
    "../",
)}" yarn.cmd workspace @collaborated/interact tsc -w; `;

cmd += `new-tab --startingDirectory "${path.resolve(
    __dirname,
    "../",
)}" yarn.cmd workspace @collaborated/common tsc -w; `;

cmd += `new-tab --startingDirectory "${path.resolve(
    __dirname,
    "../",
)}" yarn.cmd workspace test-addon tsc -w; `;

if (process.argv.includes("--cmd")) {
    cmd += `new-tab --startingDirectory "${path.resolve(
        __dirname,
        "../",
    )}" cmd\n`;
} else if (!process.argv.includes("--builds")) {
    cmd += `new-tab --startingDirectory "${path.resolve(
        __dirname,
        "../",
    )}" yarn.cmd workspace server node .\n`;
}

exec(cmd, {
    stdio: "pipe",
});
