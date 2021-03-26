import { ColourTheme } from "./theme";
import themeToScheme from "./scheme";

//https://ant.design/docs/spec/colors

export function lightTheme(): ColourTheme {
    return themeToScheme(
        {
            accent: [
                "#000000",
                "#141414",
                "#1f1f1f",
                "#262626",
                "#434343",
                "#595959",
                "#8c8c8c",
                "#bfbfbf",
                "#d9d9d9",
                "#f0f0f0",
                "#f5f5f5",
                "#fafafa",
                "#ffffff",
            ],
            primary: [
                "#e6f7ff",
                "#bae7ff",
                "#91d5ff",
                "#69c0ff",
                "#40a9ff",
                "#1890ff",
                "#096dd9",
                "#0050b3",
                "#003a8c",
                "#002766",
            ],
            error: [
                "#fff1f0",
                "#ffccc7",
                "#ffa39e",
                "#ff7875",
                "#ff4d4f",
                "#f5222d",
                "#cf1322",
                "#a8071a",
                "#820014",
                "#5c0011",
            ],
        },
        {
            name: "Light",
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
        (s, _o) => ({
            login: {
                bg: s.accent[9],
                header: {
                    bg: s.accent[8],
                },
            },
            button: {
                primary: {
                    color: s.accent[11],
                },
            },
        }),
    );
}
