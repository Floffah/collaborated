import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export function getTheme(theme?: "dark" | "light" | string): ColourTheme {
    const find = theme || localStorage.getItem("capp:theme") || "dark";
    if (find === "dark") {
        return darkTheme();
    }
    if (find === "light") {
        return lightTheme();
    }
    return darkTheme();
}

export interface ColourTheme {
    name?: string;
    font?: string;

    navbar?: {
        bg?: string;
        partbg?: string;
        parthbg?: string;
    };

    page?: {
        bg?: string;
    };

    base?: {
        color?: string;
    };

    login?: {
        particles?: {
            color?: string;
        };
        bg?: string;
        header?: {
            color?: string;
            bg?: string;
        };
        sepcolor?: string;
        linkcolor?: string;
    };

    checkbox?: {
        bg?: string;
        color?: string;
        border?: {
            on?: string;
            off?: string;
            offhover?: string;
        };
    };

    button?: {
        color?: string;
        bg?: string;
        hover?: string;
        active?: string;
        focus?: string;

        primary?: {
            color?: string;
            bg?: string;
            hover?: string;
            active?: string;
        };
    };

    input?: {
        bg?: string;
        color?: string;
        placeholder?: string;
        error?: string;
        hover?: string;
        errhover?: string;
    };

    tooltip?: {
        color?: string;
        bg?: string;
    };

    discreteModal?: {
        bg?: string;
        titlecolor?: string;
        color?: string;
        sepcolor?: string;
    };
}
