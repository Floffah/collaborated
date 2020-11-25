module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-essentials",
        "@storybook/addon-links",
        "@storybook/addon-storysource",
        "@storybook/addon-a11y",
        "storybook-mobile",
        "themeprovider-storybook/register",
        //"storybook-addon-playroom"// playground currently disabled until they add support for webpack 5 and react 17
    ],
}
