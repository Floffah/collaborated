import styled from "styled-components";
import { darken } from "polished";

export const GroupListContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: 70px;
    height: 100%;
    background-color: ${(props) => props.theme.projects.list.bg};
    padding: 5px 10px 0 10px;
    box-sizing: border-box;
`;

export const GroupListSeparator = styled.div`
    height: 1px;
    width: 40px;
    position: relative;
    margin: 5px 5px;
    background-color: ${(props) =>
        darken(0.2, props.theme.projects.list.separator)};
`;
