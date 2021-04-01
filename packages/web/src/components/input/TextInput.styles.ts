import styled from "styled-components";

export const BaseInput = styled.input<{ contained: boolean; error: boolean }>`
    padding: 2px 7px;
    background-color: ${(props) => props.theme.input.bg};
    color: ${(props) => props.theme.input.color};
    font-family: ${(props) => props.theme.font};

    outline: none;
    border-radius: ${(props) => (props.contained ? "0" : "2px")};
    border: ${(props) =>
        props.contained
            ? "none"
            : props.error
            ? `1px solid ${props.theme.input.error}`
            : `1px solid ${props.theme.input.bg}`};
    transition: 0.1s border;
    display: ${(props) => (props.contained ? "inline-block" : "block")};
    margin: ${(props) => (props.contained ? "0" : "unset")};
    box-sizing: border-box;

    &::placeholder {
        color: ${(props) => props.theme.input.placeholderColor};
        user-select: none;
    }

    &:hover {
        ${(props) =>
            props.contained
                ? ""
                : props.error
                ? ""
                : `border: 1px solid ${props.theme.input.borderHover};`};
    }
`;

export const InputContainer = styled.div<{ error: boolean }>`
    border-radius: 2px;
    border: ${(props) =>
        props.error
            ? `1px solid ${props.theme.input.error}`
            : `1px solid ${props.theme.input.bg}`};
    transition: 0.1s border;
    background-color: ${(props) => props.theme.input.bg};
    padding: 0;

    &:hover {
        ${(props) =>
            props.error
                ? ""
                : `border: 1px solid ${props.theme.input.borderHover};`}
    }
`;

export const IconContainer = styled.div<{ clickable: boolean }>`
    margin: 0;
    display: inline-block;
    position: relative;
    user-select: none;
    cursor: ${(props) => (props.clickable ? "pointer" : "not-allowed")};
`;
