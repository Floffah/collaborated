// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");

module.exports = {
    i18n: {
        locales: ["en", "es"],
        defaultLocale: "en",
    },
    localePath: resolve("./public/locale"),
    defaultNS: "common",
};
