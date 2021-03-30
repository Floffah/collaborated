// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    localePath: path.resolve("./public/locale"),
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
};
