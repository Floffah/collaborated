import React from "react";

import { BaseButton } from "./Button.styles";

export interface ButtonProps {
    fontSize?: number;
    disabled?: boolean;
    type?: "default" | "primary";
    style?: React.CSSProperties;

    onClick?: (e: MouseEvent) => void;
}

export default class Button extends React.Component<ButtonProps> {
    static defaultProps: ButtonProps = {
        fontSize: 15,
        type: "default",
    };

    handleClick(e: MouseEvent) {
        if (!this.props.disabled && !!this.props.onClick) {
            this.props.onClick(e);
        }
    }

    render() {
        const fontSize = this.props.fontSize ?? 15;
        const cprops = {
            style: {
                padding: `${fontSize / 4}px ${fontSize / 2}px`,
                fontSize: fontSize - 2,
                ...(this.props.style ?? {}),
            },
            disabled: !!this.props.disabled,
            btype: (this.props.type as string) ?? "default",
            onClick: (e: unknown) => this.handleClick(e as MouseEvent),
        };

        return <BaseButton {...cprops}>{this.props.children}</BaseButton>;
    }
}
