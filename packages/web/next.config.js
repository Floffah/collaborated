// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tm = require("next-transpile-modules")(["@collaborated/interact", "crypto-random-string"], {
    resolveSymlinks: true,
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

path.resolve("./public/static/locales");

module.exports = tm({
    reactStrictMode: true,
    i18n,
    webpack5: true,
    future: {
        modern: true,
    },
    eslint: {
        ignoreDuringBuilds: true, // it is ran as a script during building the whole project as next doesnt pick up the eslintignore file to ignore the nexus typgen file.
    },
});
