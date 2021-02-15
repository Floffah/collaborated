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
                    <ListPart>
                        <HomeIcon path={mdiHome} />
                    </ListPart>
                </NavBar>
            </RootContainer>
        );
    }
}

const HomeIcon = styled(SIcon)`
    width: 35px;
    height: 35px;
`;
const ListPart = styled.div`
    width: 35px;
    height: 35px;
    background-color: ${(props) => props.theme.navbar.partbg};
    padding: 5px;
    margin: 5px;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.15s background-color;

    &:hover {
        background-color: ${(props) => props.theme.navbar.parthbg};
    }
`;

const NavBar = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 50px;
    height: 100%;
    background-color: ${(props) => props.theme.navbar.bg};
`;
