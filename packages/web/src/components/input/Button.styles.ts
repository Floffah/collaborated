import styled from "styled-components";

export const BaseButton = styled.button<{ disabled: boolean; btype: string }>`
    min-width: 50px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

    border: 1px solid ${(props) => props.theme.button[props.btype].background};
    outline: none;
    border-radius: 2px;

    background-color: ${(props) => props.theme.button[props.btype].background};
    color: ${(props) => props.theme.button[props.btype].text};
    transition: 0.1s background-color;

    &:hover {
        background-color: ${(props) =>
            props.disabled
                ? props.theme.button[props.btype].background
                : props.theme.button[props.btype].backgroundHover};
    }

    &:active {
        background-color: ${(props) =>
            props.theme.button[props.btype].background};
    }
`;
