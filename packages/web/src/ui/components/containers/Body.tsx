import styled from "styled-components";
import { ColourTheme, getTheme } from "../../colours/theme";
import { RootContainer } from "../../ui";
import { mdiHome } from "@mdi/js";
import * as React from "react";
import { AppContainer } from "../../../app/AppContainer";

import { SIcon } from "../common/Icons";

export default class Body extends React.Component<any, { theme: ColourTheme }> {
    constructor(p: any) {
        super(p);

        this.state = {
            theme: getTheme(),
        };
    }

    componentDidMount() {
        if (AppContainer.inst.client == undefined) {
            AppContainer.inst.reuseClient();
        }
    }

    render() {
        return (
            <RootContainer>
                <NavBar>
                    <SIcon path={mdiHome} />
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
