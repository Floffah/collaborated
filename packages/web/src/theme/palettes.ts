import { merge } from "src/lib/objects";
import { Theme } from "./themes";

export default function fromPalette(
    p: Palette,
    o: PaletteOpts,
    override: (p: Palette, o: PaletteOpts) => Theme,
): Theme {
    const theme: Theme = {
        name: o.name,
        font: o.font,
        pagebg: p.accent[11],
        text: {
            defaultColor: p.accent[1],
            defaultHeaderColor: p.accent[2],
        },

        links: {
            color: p.primary[7],
            active: p.primary[6],
        },
    };

    merge(theme, override(p, o));

    return theme;
}

export interface PaletteOpts {
    name: string;
    font: string;
}

export interface Palette {
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
