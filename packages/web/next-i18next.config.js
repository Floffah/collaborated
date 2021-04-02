// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
    ns: ["common", "errors", "login"],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
    localePath: path.resolve("./public/locales"),
};
