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
}
