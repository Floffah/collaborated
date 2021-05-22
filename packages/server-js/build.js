// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require("esbuild");

const dev = process.argv.includes("--dev") || process.argv.includes("-d");

build({
    bundle: true,
    target: "node16.0",
    platform: "node",
    watch: dev,
    color: true,
    logLevel: "info",
    minify: !dev,
    minifyIdentifiers: !dev,
    minifySyntax: !dev,
    minifyWhitespace: !dev,
    format: "cjs",
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/server.js",
    external: ["_http_common", "mercurius", "fastify", "graphql", "prisma", "@prisma/client"],
});
