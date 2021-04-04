import { darken } from "polished";
import styled from "styled-components";

export const BaseButton = styled.button<{ bdisabled: boolean; btype: string }>`
    min-width: 50px;
    cursor: ${(props) => (props.bdisabled ? "not-allowed" : "pointer")};
    outline: none;
    border-radius: 2px;
    transition: 0.1s background-color;
    user-select: none;

    // ---
    color: ${(props) =>
        props.bdisabled
            ? darken(0.3, props.theme.button[props.btype].text)
            : props.theme.button[props.btype].text};
    background-color: ${(props) =>
        props.bdisabled
            ? darken(0.2, props.theme.button[props.btype].background)
            : props.theme.button[props.btype].background};
    border: 1px solid
        ${(props) =>
            props.bdisabled
                ? darken(0.2, props.theme.button[props.btype].background)
                : props.theme.button[props.btype].background};
    // ---

    &:hover {
        background-color: ${(props) =>
            props.bdisabled
                ? darken(0.2, props.theme.button[props.btype].background)
                : props.theme.button[props.btype].backgroundHover};
    }

    &:active {
        background-color: ${(props) =>
            props.bdisabled
                ? darken(0.2, props.theme.button[props.btype].background)
                : props.theme.button[props.btype].background};
    }
`;
