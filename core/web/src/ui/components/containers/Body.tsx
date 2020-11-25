import * as React from "react";
import styled, {ThemeProvider} from "styled-components";
import {HomeOutlined} from "@ant-design/icons";
import {ColourTheme, getTheme} from "../../colours/theme";
import {RootContainer} from "../../ui";

export default class Body extends React.Component<any, {theme: ColourTheme}> {
    constructor(p:any) {
        super(p);

        this.state = {
            theme: getTheme()
        }
    }

    render() {
        return <ThemeProvider theme={this.state.theme}>
            <RootContainer>
                <NavBar>
                    <HomeOutlined/>
                </NavBar>
            </RootContainer>
        </ThemeProvider>
    }
}

const NavBar = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 60px;
    height: 100%;
    background-color: ${props => props.theme.navbar.bg};
`
