module.exports = {
    stories: [
        "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
        "../docs/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    ],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-links",
        "@storybook/addon-storysource",
        "@storybook/addon-a11y",
        "storybook-mobile",
        "@react-theming/storybook-addon",
    ],
};
