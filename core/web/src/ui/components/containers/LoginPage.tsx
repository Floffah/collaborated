import * as React from "react";
import styled, {ThemeProvider} from "styled-components";
import {getTheme} from "../../colours/theme";
import Login from "../menus/Login";
import Particles from "react-tsparticles";

let theme = getTheme();

export class LoginPage extends React.Component<any> {
    render() {
        return <ThemeProvider theme={theme}>
            <StyledParticles options={particleopts}/>
            <Login/>
        </ThemeProvider>
    }
}

const StyledParticles = styled(Particles)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const particleopts = {
    background: {
        color: {
            value: getTheme().page.bg,
        },
    },
    fpsLimit: 60,
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
                    smooth: 25
                }
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
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: false,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: true,
            mode: "bounce"
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
            value: 100,
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
}