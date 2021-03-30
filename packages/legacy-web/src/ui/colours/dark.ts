import { ColourTheme } from "./theme";
import themeToScheme from "./scheme";

//https://ant.design/docs/spec/colors
//https://ant.design/docs/spec/dark

export function darkTheme(): ColourTheme {
    return themeToScheme(
        {
            accent: [
                "#ffffff",
                "#fafafa",
                "#f5f5f5",
                "#f0f0f0",
                "#d9d9d9",
                "#bfbfbf",
                "#8c8c8c",
                "#595959",
                "#434343",
                "#262626",
                "#1f1f1f",
                "#141414",
                "#000000",
            ],
            primary: [
                "#111d2c",
                "#112a45",
                "#15395b",
                "#164c7e",
                "#1765ad",
                "#177ddc",
                "#3c9ae8",
                "#65b7f3",
                "#8dcff8",
                "#b7e3fa",
            ],
            error: [
                "#2a1215",
                "#431418",
                "#58181c",
                "#791a1f",
                "#a61d24",
                "#d32029",
                "#e84749",
                "#f37370",
                "#f89f9a",
                "#fac8c3",
            ],
        },
        {
            name: "Dark",
            font:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
            components: {
                button: {
                    useActive: true,
                    primary: {
                        useColor: false,
                        useActive: true,
                    },
                },
            },
        },
    );
    // return {
    //     name: "Dark",
    //     font:
    //         "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    //
    //     navbar: {
    //         bg: "#000000", //gray13
    //     },
    //
    //     page: {
    //         bg: "#141414", //gray12
    //     },
    //
    //     login: {
    //         bg: "#1f1f1f", //gray11
    //         header: {
    //             color: "#d9d9d9", //gray5
    //             bg: "#262626", //gray10
    //         },
    //         sepcolor: "#434343", //gray9
    //         linkcolor: "#177ddc", //blue6
    //     },
    //
    //     checkbox: {
    //         bg: "#177ddc", //blue6
    //         color: "#ffffff", //gray1
    //         border: {
    //             on: "#164c7e", //blue4
    //             off: "#d9d9d9", //gray5
    //             offhover: "#8dcff8", //blue9
    //         },
    //     },
    //
    //     button: {
    //         color: "#f5f5f5", //gray3
    //         bg: "#141414", //gray12
    //         hover: "#262626", //gray10
    //         active: "#000000", //gray13
    //         focus: "#65b7f3", //blue8
    //
    //         primary: {
    //             //color: "#b7e3fa",//blue10
    //             bg: "#177ddc", //blue6
    //             hover: "#3c9ae8", //blue7
    //             active: "#1765ad", //blue5
    //         },
    //     },
    //
    //     input: {
    //         bg: "#141414", //gray12
    //         color: "#f5f5f5", //gray3
    //         placeholder: "#595959", //gray8
    //         error: "#a61d24", //red5
    //         hover: "#112a45", //blue2
    //         errhover: "#d32029", //red6
    //     },
    //
    //     tooltip: {
    //         color: "#ffffff", //gray1
    //         bg: "#141414", //gray12
    //     },
    //
    //     discreteModal: {
    //         bg: "#1f1f1f", //gray11
    //         titlecolor: "#d9d9d9", //gray5
    //         color: "#ffffff", //gray1
    //         sepcolor: "#434343", //gray9
    //     },
    // };
}
