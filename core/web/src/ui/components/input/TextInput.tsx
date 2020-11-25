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
}

interface TextInputState {
    value: string
}

export default class TextInput extends React.Component<TextInputProps, TextInputState> {
    constructor(p: TextInputProps) {
        super(p);

        this.state = {
            value: ""
        }
    }

    handleChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: e.target.value
        });
    }

    render() {
        let final = <TextBasedInput
            type={this.props.mode || "text"}
            onChange={(e) => this.handleChange(e)}
            autoComplete={this.props.autoComplete || "off"}
            value={this.state.value}
            placeholder={this.props.placeholder || "text"}

            err={this.state.value === "" && !!this.props.notEmpty}
        />

        return final;
    }
}

const BaseInput = styled.input<{err:boolean}>`
    width: 200px;
    height: 30px;
    
    padding: 2px;
    padding-right: 7px;
    padding-left: 7px;
    
    background-color: ${props => props.theme.input.bg};
    color: ${props => props.theme.input.color};
    font-size: 15px;
    
    outline: none;
    border-radius: 2px;
    border: 1px solid ${props => props.err ? props.theme.input.error : props.theme.input.bg};
    
    transition: 0.25s border;
    
    &::placeholder {
        color: ${props => props.theme.input.placeholder}
    }
`


const TextBasedInput = styled(BaseInput)`

`
