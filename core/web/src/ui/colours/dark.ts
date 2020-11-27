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

        button: {
            color: "",
            bg: ""
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
