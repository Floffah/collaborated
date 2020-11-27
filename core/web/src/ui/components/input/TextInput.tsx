import * as React from "react";
import {ChangeEvent} from "react";
import styled from "styled-components";

export interface TextInputProps {
    autoComplete?: "on" | "off" |
        "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffux" | "nickname" |
        "email" |
        "username" |
        "new-password" |
        "current-password" |
        "one-time-code" |
        "organization-title" |
        "organization" |
        "street-address" |
        "address-line1" | "address-line2" | "address-line3" |
        "address-level4" |
        "address-level3" |
        "address-level2" |
        "address-level1" |
        "country" | "country-name" |
        "postal-code" |
        "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-csc" | "cc-type" |
        "transaction-currency" | "transaction-amount" |
        "language" |
        "bday" | "bday-day" | "bday-month" | "bday-year" |
        "sex" |
        "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension" |
        "impp" |
        "url" |
        "photo"
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete for this. i made it specifically typed because i will forget.
    mode?: "text" | "search" | "tel" | "url" | "email" | "number" | "password",
    notEmpty?: boolean,
    placeholder?: string,
    width?: number,
    height?: number,
    fontSize?: number,
    errorLabel?: boolean,
    errorWait?: boolean
}

interface TextInputState {
    value: string,
    errors: InputErrors[],
    renders: number
}

enum InputErrors {
    Empty = "Cannot be empty.",
    EmailFormat = "Must be an email. (Example: example@example.com)"
}

export default class TextInput extends React.Component<TextInputProps, TextInputState> {
    renders: number = 0;
    static defaultProps: TextInputProps = {
        autoComplete: "off",
        mode: "text",
        notEmpty: false,
        placeholder: "text",
        width: 200,
        height: 30,
        fontSize: 15,
        errorLabel: false,
        errorWait: false,
    };

    constructor(p: TextInputProps) {
        super(p);

        this.state = {
            value: "",
            errors: [],
            renders: 0
        }
    }

    handleChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: e.target.value
        });
    }

    render() {
        let needsExtra = false;
        if(this.state.value === "" && !!this.props.notEmpty && !this.state.errors.includes(InputErrors.Empty) && (!this.props.errorWait || (this.props.errorWait && this.renders > 1))) {
            this.state.errors.push(InputErrors.Empty);
        } else if(this.state.errors.includes(InputErrors.Empty)) {
            this.state.errors.splice(this.state.errors.indexOf(InputErrors.Empty), 1)
        }
        let iprops = {
            type: this.props.mode || "text",
            onChange: (e: ChangeEvent<HTMLInputElement>) => this.handleChange(e),
            autoComplete: this.props.autoComplete || "off",
            value: this.state.value,
            placeholder: this.props.placeholder || "text",

            err: this.state.errors.length >= 1,
            iwidth: this.props.width || 200,
            iheight: this.props.height || 30,
            ifontSize: this.props.fontSize || 15,
        }
        if (this.props.errorLabel) {
            needsExtra = true;
        }
        if (needsExtra) {
            let contained: JSX.Element[] = [
                <BaseInput key={0} {...iprops}/>
            ];

            if(this.props.errorLabel) {
                contained.push(<ErrorLabel>{this.state.errors.length >= 1 ? this.state.errors[0] : "⠀"}</ErrorLabel>)
            }

            this.renders++;
            return <InputContainer>{contained}</InputContainer>
        } else {
            this.renders++;
            return <BaseInput {...iprops}/>;
        }
    }
}

const ErrorLabel = styled.p`
    font-family: ${props => props.theme.font};
    color: ${props => props.theme.input.error};
    margin: 0;
    font-size: 15px;
`

export const BaseInput = styled.input<{ err: boolean, iwidth?: number, iheight?: number, ifontSize?: number }>`
    width: ${props => props.iwidth}px;
    height: ${props => props.iheight}px;
    
    padding: 2px;
    padding-right: 7px;
    padding-left: 7px;
    
    background-color: ${props => props.theme.input.bg};
    color: ${props => props.theme.input.color};
    font-size: ${props => props.ifontSize}px;
    font-family: ${props => props.theme.font};
    
    outline: none;
    border-radius: 2px;
    border: 1px solid ${props => props.err ? props.theme.input.error : props.theme.input.bg};
    
    transition: 0.25s border;
    
    &::placeholder {
        color: ${props => props.theme.input.placeholder}
    }
    
    &:hover {
        border: 1px solid ${props => props.err ? props.theme.input.errhover : props.theme.input.hover}
    }
`

export const InputContainer = styled.div`

`
