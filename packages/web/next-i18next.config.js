const locales = ["en", "el", "es", "fr"];

module.exports = {
    ns: ["common", "errors", "login", "seo"],
    i18n: {
        defaultLocale: "en",
        locales,
    },
    defaultNS: "common",
    preload: locales,
    localePath: typeof window === "undefined" ? "public/static/locales" : "static/locales",
    cleanCode: true,
    fallbackNS: ["common", "errors", "seo"],
    fallbackLng: "en",
};
