import { getDarkTheme } from "./dark";
import { getLightTheme } from "./light";

export function getTheme(theme: string) {
    let t: Theme;

    if (theme === "light") {
        t = getLightTheme();
    } else {
        t = getDarkTheme();
    }

    return t;
}

export interface Theme {
    name?: string;
    font?: string;
    pagebg?: string;

    text?: {
        defaultColor?: string;
        defaultHeaderColor?: string;
    };

    links?: {
        color?: string;
        active?: string;
    };

    login?: {
        particlecolor?: string;
        bg?: string;
        header?: {
            bg?: string;
            color?: string;
        };
    };

    input?: {
        bg?: string;
        error?: string;
        color?: string;
        placeholderColor?: string;
        borderHover?: string;
    };

    button?: {
        default?: Button;
        primary?: Button;
    };

    projects?: {
        list?: {
            bg?: string;
        };
        element?: {
            bg?: string;
            bgHover?: string;
        };
    };
}

interface Button {
    background?: string;
    backgroundHover?: string;
    text?: string;
}
