module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["workspaces", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "prettier",
        "plugin:@typescript-eslint/recommended",
        "next"
    ],
    globals: {
        JSX: "readonly",
    },
    rules: {
        "workspaces/no-relative-imports": "error",
        "workspaces/require-dependency": "warn",
        "workspaces/no-cross-imports": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/prop-types": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: false,
            },
        ],
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
