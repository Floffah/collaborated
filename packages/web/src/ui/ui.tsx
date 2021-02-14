import Body from "./components/containers/Body";
import { LoginPage } from "./components/containers/LoginPage";
import styled from "styled-components";
import { AppContainer } from "../app/AppContainer";
import { AppContextProvider } from "../util/AppContext";
import i18next from "i18next";
import * as React from "react";

import { render } from "react-dom";

export default function ui(appc: AppContainer) {
    i18next.init({
        interpolation: {
            escapeValue: false,
        },
    });

    if (appc.loginable()) {
        render(
            <AppContextProvider appcontainer={appc} i18next={i18next}>
                <Body />
            </AppContextProvider>,
            getRoot(),
        );
    } else {
        render(
            <AppContextProvider appcontainer={appc} i18next={i18next}>
                <LoginPage />
            </AppContextProvider>,
            getRoot(),
        );
    }
}

function getRoot(): HTMLElement {
    let root = document.getElementById("root");
    if (root === null) {
        root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
    }
    return root;
}

export const RootContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    background-color: ${(props) => props.theme.page.bg};
    margin: 0;
`;
