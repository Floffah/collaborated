import {render} from "react-dom";
import Body from "./components/containers/Body";
import * as React from "react";
import {LoginPage} from "./components/containers/LoginPage";
import styled from "styled-components";
import {AppContainer} from "../AppContainer";
import {AppContextProvider} from "../util/AppContext";

export default function ui(appc: AppContainer) {
    if (!!localStorage.getItem("access")) {
        render(<AppContextProvider appcontainer={appc}><Body/></AppContextProvider>, document.getElementById("root"));
    } else {
        render(<AppContextProvider appcontainer={appc}><LoginPage/></AppContextProvider>, document.getElementById("root"));
    }
}

export const RootContainer = styled.div`
position: fixed;
width: 100%;
height: 100%;
left: 0;
right: 0;
background-color: ${props => props.theme.page.bg};
margin: 0;
`
