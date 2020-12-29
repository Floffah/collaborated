import * as React from "react";
import styled from "styled-components";
import { ColourTheme, getTheme } from "../../colours/theme";
import { RootContainer } from "../../ui";
import Icon from "@mdi/react";
import { mdiHome } from "@mdi/js";

export default class Body extends React.Component<any, { theme: ColourTheme }> {
    constructor(p: any) {
        super(p);

        this.state = {
            theme: getTheme(),
        };
    }

    render() {
        return (
            <RootContainer>
                <NavBar>
                    <Icon path={mdiHome} />
                </NavBar>
            </RootContainer>
        );
    }
}

const NavBar = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 60px;
    height: 100%;
    background-color: ${(props) => props.theme.navbar.bg};
`;
