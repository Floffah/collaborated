module.exports = {
    mount: {
        public: "/",
        src: "/media"
    },
    exclude: ['**/node_modules/**/*', '**/__tests__/*', '**/*.@(spec|test).@(js|mjs)', '**/*.stories.@(tsx|mdx)'],
    plugins: ["@snowpack/plugin-optimize", "@snowpack/plugin-typescript"],
    installOptions: {
        treeshake: true,
        installTypes: true,
        polyfillNode: true,
        packageLookupFields: ["@collaborated/interact"]
    },
    devOptions: {
        open: "none"
    },
    buildOptions: {
        sourceMaps: true,
        baseUrl: "./",
    }
}
