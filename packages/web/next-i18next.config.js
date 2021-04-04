// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const locales = ["en"];

module.exports = {
    ns: ["common", "errors", "login", "seo"],
    i18n: {
        defaultLocale: "en",
        locales,
    },
    defaultNS: "common",
    react: {
        useSuspense: false,
    },
    preload: locales,
    localePath: path.resolve("./public/locales"),
    cleanCode: true,
    fallbackNS: ["common", "errors", "seo"],
    fallbackLng: "en",
};
