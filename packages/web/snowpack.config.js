module.exports = {
    mount: {
        public: "/",
        src: "/media",
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
