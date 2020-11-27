import {darkTheme} from "./dark";

export function getTheme(theme?: string): ColourTheme {
    let find = theme || localStorage.getItem("capp:theme") || "dark";
    if (find === "dark") {
        return darkTheme();
    }// else if(find === "night") {
    //     return nightTheme();
    // }
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
    }

    button: {
        color: string,
        bg: string,
    }

    input: {
        bg: string,
        color: string,
        placeholder: string,
        error: string,
        hover: string,
        errhover: string,
    }
}
