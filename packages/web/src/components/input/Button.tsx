import React, {
    ForwardedRef,
    forwardRef,
    PropsWithChildren,
    RefObject,
} from "react";

import { BaseButton } from "./Button.styles";

export interface IButtonProps {
    fontSize?: number;
    disabled?: boolean;
    type?: "default" | "primary";
    style?: React.CSSProperties;

    onClick?: (e: MouseEvent) => void;
}

export type ButtonProps = PropsWithChildren<
    IButtonProps & {
        buttonRef?:
            | RefObject<HTMLButtonElement>
            | ForwardedRef<HTMLButtonElement>;
    }
>;

class CButton extends React.Component<ButtonProps> {
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

        const forwardprops: any = {
            ...this.props,
            fontSize: undefined,
            disabled: undefined,
            type: undefined,
            style: undefined,
            onClick: undefined,
        };

        const cprops = {
            ...forwardprops,
            style: {
                padding: `${fontSize / 4}px ${fontSize / 2}px`,
                fontSize: fontSize - 2,
                ...(this.props.style ?? {}),
            },
            bdisabled: !!this.props.disabled,
            btype: (this.props.type as string) ?? "default",
            onClick: (e: unknown) => this.handleClick(e as MouseEvent),
            ref: this.props.buttonRef,
        };

        return <BaseButton {...cprops} />;
    }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((p, r) => (
    <CButton {...p} buttonRef={r} />
));
Button.displayName = "Button";

export default Button;
