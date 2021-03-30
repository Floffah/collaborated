// eslint-disable-next-line @typescript-eslint/no-var-requires
const tm = require("next-transpile-modules")(["@collaborated/interact"], {
    resolveSymlinks: true,
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");

module.exports = tm({
    reactStrictMode: true,
    trailingSlash: true,
    productionBrowserSourceMaps: true,
    target: "serverless",
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    localePath: resolve("./public/locale"),
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
    future: {
        webpack5: true,
    },
});
