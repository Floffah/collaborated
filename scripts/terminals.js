const {exec} = require('child_process');
const path = require('path');

let cmd = `wt `
cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace web snowpack dev; `;
cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace web start-storybook -p 6006; `; // playground currently disabled until they add support for webpack 5 and react 17
cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace server tsc -w; `
cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace @collaborated/interact tsc -w; `
cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace @test-addon tsc -w; `
if(process.argv.includes("--cmd")) {
    cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} cmd\n`;
} else {
    cmd += `new-tab --startingDirectory ${path.resolve(__dirname, '../')} yarn.cmd workspace server node .\n`;
}

exec(cmd, {
    stdio: 'pipe'
});
