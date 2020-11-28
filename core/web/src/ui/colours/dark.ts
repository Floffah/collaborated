import {ColourTheme} from "./theme";

export function darkTheme():ColourTheme {
    return {
        name: "Dark",
        font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

        navbar: {
            bg: "#000000"//gray13
        },

        page: {
            bg: "#141414"//gray12
        },

        login: {
            bg: "#1f1f1f",//gray11
            header: {
                color: "#d9d9d9",
                bg: "#262626"//gray10
            },
        },

        checkbox: {
            bg: "#177ddc",
            color: "#ffffff",
            border: {
                on: "#164c7e",
                off: "#d9d9d9",
                offhover: "#8dcff8"
            }
        },

        button: {
            color: "#f5f5f5",//gray3
            bg: "#141414",//gray12
            hover: "#262626",//gray10
            active: "#000000",//gray13
            focus: "#65b7f3",

            primary: {
                //color: "#b7e3fa",//blue10
                bg: "#177ddc",//blue6
                hover: "#3c9ae8",//blue7
                active:"#1765ad"//blue5
            }
        },

        input: {
            bg: "#141414", //gray12
            color: "#f5f5f5", //gray3
            placeholder: "#595959", //gray8
            error: "#a61d24", //red5
            hover: "#112a45", //blue2
            errhover: "#d32029"
        }
    }
}
