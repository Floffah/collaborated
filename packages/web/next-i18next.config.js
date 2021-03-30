// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
    ns: ["common", "errors"],
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
    localePath: path.resolve("./public/locales"),
};
