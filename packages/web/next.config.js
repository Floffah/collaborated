// eslint-disable-next-line @typescript-eslint/no-var-requires
const tm = require("next-transpile-modules")(["@collaborated/interact"]);

module.exports = tm({
    reactStrictMode: true,
});
