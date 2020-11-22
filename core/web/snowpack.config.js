module.exports = {
    mount: {
        public: "/",
        src: "/media"
    },
    exclude: ['**/node_modules/**/*', '**/__tests__/*', '**/*.@(spec|test).@(js|mjs)', '**/*.stories.@(tsx|mdx)'],
    plugins: ["@snowpack/plugin-optimize", "@snowpack/plugin-postcss", "@snowpack/plugin-typescript", "@snowpack/plugin-sass", "@snowpack/plugin-webpack"],
    installOptions: {
        treeshake: true,
        installTypes: true,
    }
}
