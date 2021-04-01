import React, { RefObject } from "react";

import { BaseInput, IconContainer, InputContainer } from "./TextInput.styles";
import StyledIcon from "../util/StyledIcon";

export interface TextInputProps {
    autoComplete?: AutoCompleteType;
    mode?: "text" | "email" | "password";
    placeholder?: string;
    width?: number;
    height?: number;
    fontSize?: number;
    inputRef?: RefObject<HTMLInputElement>;
    style?: React.CSSProperties;
    error?: boolean;

    icon?: string;
    iconClickable?: boolean;
}

export default class TextInput extends React.Component<TextInputProps> {
    static defaultProps: TextInputProps = {
        autoComplete: "off",
        mode: "text",
        placeholder: "Text",
        width: 200,
        height: 30,
        fontSize: 15,
    };

    render() {
        const height = this.props.height ?? 30;
        const width = this.props.width ?? 200;
        const props = {
            type: this.props.mode ?? "text",
            autoComplete: this.props.autoComplete ?? "off",
            placeholder: this.props.placeholder,
            ref: this.props.inputRef,
            style: {
                fontSize: this.props.fontSize ?? 15,
                width,
                height,
                maxWidth: width,
                maxHeight: height,
                display: "block",
            } as React.CSSProperties,
            contained: !!this.props.icon,
            error: this.props.error ?? false,
        };

        if (this.props.icon) {
            props.style.width =
                ((props.style.width as number) ?? 200) - height - 1;
            props.style.height = height - 2;
            props.style.top = 1;
            props.style.display = "inline-block";
            props.style.position = "relative";
            props.style.verticalAlign = "top";
        } else {
            props.style = { ...props.style, ...this.props.style };
        }

        const input = <BaseInput {...props} />;

        if (this.props.icon) {
            const iconpadding = height * 0.25;
            return (
                <InputContainer
                    style={{
                        height: height,
                        width: width,
                        ...this.props.style,
                    }}
                    error={props.error}
                >
                    <IconContainer
                        clickable={this.props.iconClickable ?? false}
                        style={{
                            padding: `${iconpadding}px ${iconpadding}px ${iconpadding}px ${iconpadding}px`,
                            height: height * 0.5,
                        }}
                    >
                        <StyledIcon
                            path={this.props.icon}
                            style={{
                                height: height * 0.5,
                                width: height * 0.5,
                                fontSize: height * 0.5,
                                display: "inline-block",
                            }}
                        />
                    </IconContainer>
                    {input}
                </InputContainer>
            );
        }

        return input;
    }
}

export type AutoCompleteType =
    | "on"
    | "off"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffux"
    | "nickname"
    | "email"
    | "username"
    | "new-password"
    | "current-password"
    | "one-time-code"
    | "organization-title"
    | "organization"
    | "street-address"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level4"
    | "address-level3"
    | "address-level2"
    | "address-level1"
    | "country"
    | "country-name"
    | "postal-code"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | "language"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-area-code"
    | "tel-local"
    | "tel-extension"
    | "impp"
    | "url"
    | "photo";
