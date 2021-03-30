import React from "react";
import { Palette } from "./palettes";
import styled from "styled-components";
import { darkThemePalette } from "./dark";
import { lightThemePalette } from "./light";

interface PTProps {
    palette?: Palette;
    paletteName?: "dark" | "light";
}

export const PaletteTester: React.FC<PTProps> = (p) => {
    const groups: JSX.Element[] = [];
    let plt: Palette | undefined = p.palette;

    if (p.paletteName) {
        const name = p.paletteName ?? "dark";
        if (name === "dark") {
            plt = darkThemePalette;
        } else if (name === "light") {
            plt = lightThemePalette;
        }
    }

    if (!plt) {
        return <p>Could not read</p>;
    }

    for (const g of Object.keys(plt)) {
        const colours: JSX.Element[] = [];

        for (const c of ((plt as unknown) as { [k: string]: any[] })[g]) {
            colours.push(
                <Colour
                    key={colours.length}
                    style={{ backgroundColor: c }}
                    role="textbox"
                    aria-multiline={true}
                    onClick={async () => {
                        await navigator.clipboard.writeText(c);
                        alert("Copied " + c + " to clipboard.");
                    }}
                >
                    <p>{c}</p>
                </Colour>,
            );
        }

        groups.push(
            <Group key={groups.length}>
                <h2>{g}</h2>
                {colours}
            </Group>,
        );
    }

    return <div>{groups}</div>;
};

const Group = styled.div`
    margin-bottom: 10px;

    h2 {
        font-family: ${(props) => props.theme.font};
    }
`;

const Colour = styled.div`
    margin: 0 5px 0 5px;
    width: 50px;
    height: 50px;
    display: inline-block;
    transition: width 0.1s;
    font-family: ${(props) => props.theme.font};
    font-size: 20px;
    align-content: center;
    cursor: pointer;

    p {
        text-align: center;
        margin: auto;
        opacity: 0;
        background: inherit;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: invert(1) grayscale(1) contrast(9);
        position: relative;
        pointer-events: none;
    }

    &:hover {
        width: 100px;
        content: initial;

        p {
            opacity: 1;
        }
    }
`;
