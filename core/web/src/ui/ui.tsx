import {render} from "react-dom";
import Body from "./components/containers/Body";
import * as React from "react";
import {LoginPage} from "./components/containers/LoginPage";
import styled from "styled-components";

export default function ui() {
    if(!!localStorage.getItem("access")) {
        render(<Body/>, document.getElementById("root"));
    } else {
        render(<LoginPage/>, document.getElementById("root"));
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
