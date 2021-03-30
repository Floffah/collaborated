// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    ns: ["common", "errors"],
    localePath: path.resolve("./locale"),
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
};
