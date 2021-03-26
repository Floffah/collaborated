import styled from "styled-components";
import Login from "../menus/Login";
import Particles from "react-tsparticles";
import { PopupContainer } from "./Popups";
import * as React from "react";
import { AppContainer } from "../../../app/AppContainer";

export function LoginPage() {
    return (
        <>
            <StyledParticles options={particleopts()} />
            <Login float={true} />
            <PopupContainer />
        </>
    );
}

const StyledParticles = styled(Particles)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.page.bg};
`;

const particleopts = () => ({
    retina_detect: true,
    background: {
        color: AppContainer.inst.theme.page?.bg,
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
            value: AppContainer.inst.theme.login?.particles?.color,
        },
        links: {
            color: AppContainer.inst.theme.login?.particles?.color,
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
});
