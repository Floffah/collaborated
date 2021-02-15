import { ColourTheme } from "./theme";

export default function themeToScheme(
    scheme: Scheme,
    opts: SchemeOpts,
): ColourTheme {
    return {
        name: opts.name,
        font: opts.font,
        navbar: {
            bg: scheme.accent[12],
            partbg: scheme.accent[10],
            parthbg: scheme.accent[9],
        },
        page: {
            bg: scheme.accent[11],
        },
        base: {
            color: scheme.accent[3],
        },
        login: {
            bg: scheme.accent[10],
            header: {
                color: scheme.accent[4],
                bg: scheme.accent[9],
            },
            sepcolor: scheme.accent[8],
            linkcolor: scheme.accent[5],
        },
        checkbox: {
            bg: scheme.primary[5],
            color: scheme.accent[0],
            border: {
                on: scheme.primary[3],
                off: scheme.accent[4],
                offhover: scheme.primary[8],
            },
        },
        button: {
            color: scheme.accent[2],
            bg: scheme.accent[11],
            hover: scheme.accent[9],
            active: opts.components?.button?.useActive
                ? scheme.accent[12]
                : undefined,
            focus: scheme.primary[7],
            primary: {
                color: opts.components?.button?.primary?.useColor
                    ? scheme.primary[9]
                    : undefined,
                active: opts.components?.button?.primary?.useActive
                    ? scheme.primary[4]
                    : undefined,
                bg: scheme.primary[5],
                hover: scheme.primary[6],
            },
        },
        input: {
            bg: scheme.accent[11],
            color: scheme.accent[2],
            placeholder: scheme.accent[7],
            error: scheme.error[4],
            hover: scheme.primary[1],
            errhover: scheme.error[5],
        },
        tooltip: {
            color: scheme.accent[0],
            bg: scheme.accent[11],
        },
        discreteModal: {
            bg: scheme.accent[10],
            titlecolor: scheme.accent[4],
            color: scheme.accent[0],
            sepcolor: scheme.accent[8],
        },
    };
}

// TODO [#4]: add "offset" props to schemes
// i found when using the storybook that with the light theme, some things are a bit light and indistinguishable so i feel like an offset like "darkenBy" on certain components would be good
// i think this could be done by just adding the offset to the scheme array index

export interface SchemeOpts {
    name: string;
    font: string;
    components?: {
        button?: {
            useActive?: boolean;
            primary?: {
                useColor?: boolean;
                useActive?: boolean;
            };
        };
    };
}

export interface Scheme {
    accent: [
        string, //1
        string, //2
        string, //3
        string, //4
        string, //5
        string, //6
        string, //7
        string, //8
        string, //9
        string, //10
        string, //11
        string, //12
        string, //13
        // from ant-design's gray colour
    ];
    primary: [
        string, //1
        string, //2
        string, //3
        string, //4
        string, //5
        string, //6
        string, //7
        string, //8
        string, //9
        string, //10
        // from ant-design's daybreak blue in dark mode
    ];
    error: [
        string, //1
        string, //2
        string, //3
        string, //4
        string, //5
        string, //6
        string, //7
        string, //8
        string, //9
        string, //10
        // from ant-design's dust red in dark mode
    ];
}
