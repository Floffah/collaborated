import * as React from "react";
import styled from "styled-components";
import { ComponentProps } from "../../util/typings";

interface ButtonProps {
    type?: "default" | "primary";
    onClick?: () => void;
    size?: "small" | "medium" | "large";
    className?: string;
}

export default function Button(props: ComponentProps<ButtonProps>) {
    const defprop = {
        onClick: () => (props.onClick ? props.onClick() : undefined),
        isize: 13,
        ipadding: "5px 15px 5px 15px",
        className: props.className,
    };
    if (props.size === "medium") {
        defprop.isize = 15;
        defprop.ipadding = "7px 17px 7px 17px";
    } else if (props.size === "large") {
        defprop.isize = 17;
        defprop.ipadding = "8px 22px 8px 22px";
    }

    if (props.type === "primary") {
        return <PrimaryButton {...defprop}>{props.children}</PrimaryButton>;
    }
    return <DefaultButton {...defprop}>{props.children}</DefaultButton>;
}

Button.defaultProps = {
    type: "default",
    onClick: undefined,
    size: "small",
};

const BaseButton = styled.button<{ isize: number; ipadding: string }>`
    outline: none;
    border: none;

    font-family: ${(props) => props.theme.font};
    padding: ${(props) => props.ipadding};
    border-radius: 5px;
    cursor: pointer;
    font-size: ${(props) => props.isize}px;

    transition: background-color 0.1s;

    &:focus {
        box-shadow: 0 0 0 1px ${(props) => props.theme.button.focus};
    }
`;

const DefaultButton = styled(BaseButton)`
    color: ${(props) => props.theme.button.color};
    background-color: ${(props) => props.theme.button.bg};

    &:hover,
    &:focus {
        background-color: ${(props) => props.theme.button.hover};
    }

    &:active {
        background-color: ${(props) =>
            props.theme.button.active || props.theme.button.bg};
    }
`;

const PrimaryButton = styled(BaseButton)`
    color: ${(props) =>
        props.theme.button.primary.color || props.theme.button.color};
    background-color: ${(props) => props.theme.button.primary.bg};

    &:hover,
    &:focus {
        background-color: ${(props) => props.theme.button.primary.hover};
    }

    &:active {
        background-color: ${(props) =>
            props.theme.button.primary.active || props.theme.button.primary.bg};
    }
`;
