// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tm = require("next-transpile-modules")(["@collaborated/interact"], {
    resolveSymlinks: true,
});

module.exports = tm({
    reactStrictMode: true,
    //trailingSlash: true,
    //productionBrowserSourceMaps: true,
    target: "serverless",
    i18n,
    future: {
        webpack5: true,
    },
});
