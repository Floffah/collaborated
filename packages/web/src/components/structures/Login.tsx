import React from "react";
//import { useTranslation } from "next-i18next";
import { getTheme, Theme } from "../../theme/themes";
import Particles, { ISourceOptions } from "react-tsparticles";
import styled from "styled-components";
import { useStore } from "react-redux";
import { State } from "../../lib/store";
import { LoginMenu } from "./menus/LoginMenu";

export const Login: React.FC = (_p) => {
    //const { t } = useTranslation("common");
    const s = useStore<State>();

    return (
        <>
            <StyledParticles options={getParticleOpts(getTheme(s.getState().theme))} />
            <LoginMenu />
        </>
    );
};

const StyledParticles = styled(Particles)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.pagebg};
`;

export const getParticleOpts = (t: Theme) =>
    ({
        retina_detect: true,
        background: {
            color: t.pagebg,
            image: "",
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
            opacity: 0,
        },
        interactivity: {
            detectsOn: "window",
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                    parallax: {
                        enable: true,
                        force: 25,
                        smooth: 25,
                    },
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                grab: {
                    distance: 120,
                },
            },
        },
        particles: {
            color: {
                value: t.login?.particlecolor,
            },
            links: {
                color: t.login?.particlecolor,
                distance: 150,
                enable: false,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
                mode: "bounce",
            },
            move: {
                direction: "top",
                enable: true,
                outMode: "out",
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    value_area: 800,
                },
                value: 150,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                random: true,
                value: 5,
            },
        },
        detectRetina: true,
    } as ISourceOptions);
