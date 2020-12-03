import {darkTheme} from "./dark";

export function getTheme(theme?: string): ColourTheme {
    let find = theme || localStorage.getItem("capp:theme") || "dark";
    if (find === "dark") {
        return darkTheme();
    }
    return darkTheme();
}

export interface ColourTheme {
    name: string,
    font: string,

    navbar: {
        bg: string
    }

    page: {
        bg: string
    }

    login: {
        bg: string,
        header: {
            color: string,
            bg: string
        },
        sepcolor: string,
        linkcolor: string,
    }

    checkbox: {
        bg: string,
        color: string,
        border: {
            on: string,
            off: string,
            offhover: string,
        }
    }

    button: {
        color: string,
        bg: string,
        hover: string,
        active?:string
        focus: string,

        primary: {
            color?: string,
            bg: string,
            hover:string,
            active?:string
        }
    }

    input: {
        bg: string,
        color: string,
        placeholder: string,
        error: string,
        hover: string,
        errhover: string,
    }

    tooltip: {
        color: string
        bg: string
    }
}
