module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["workspaces", "@typescript-eslint", "react"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    rules: {
        "workspaces/no-relative-imports": "error",
        "workspaces/require-dependency": "warn",
        "workspaces/no-cross-imports": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
        prettier: true,
    },
    env: {
        node: true,
    },
};
