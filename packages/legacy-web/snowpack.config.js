// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");

const mount = {
    public: "/",
    src: "/media",
};
mount[resolve(__dirname, "../interact")] = "/media/@collaborated/interact";

module.exports = {
    mount,
    alias: {
        "@collaborated/interact": "../interact/src",
    },
    exclude: [
        "**/node_modules/**/*",
        "**/__tests__/*",
        "**/*.@(spec|test).@(js|mjs)",
        "**/*.stories.@(tsx|mdx)",
    ],
    plugins: [
        "@snowpack/plugin-optimize",
        "@snowpack/plugin-typescript",
        "@snowpack/plugin-webpack",
        //"@collaborated/snowpack-monorepo-plugin",
    ],
    packageOptions: {
        installTypes: true,
        //source: "remote",
        types: true,
        polyfillNode: true,
    },
    buildOptions: {
        sourcemap: true,
        baseUrl: "./",
    },
    optimize: {
        bundle: true,
        minify: true,
        target: "es2018",
        manifest: true,
        treeshake: true,
    },
};
