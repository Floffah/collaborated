import * as React from "react";
import styled from "styled-components";
import Icon from "@mdi/react";
import { mdiCheckBold, mdiCheckOutline } from "@mdi/js";

export interface CheckBoxProps {
    className?: string;
    defaultChecked?: boolean;
    outlineIcon?: boolean;
    label?: string;
    onChange?: (checked: boolean) => void;
}

interface CheckBoxState {
    checked: boolean;
}

export default class CheckBox extends React.Component<
    CheckBoxProps,
    CheckBoxState
> {
    static defaultProps: CheckBoxProps = {
        defaultChecked: false,
        outlineIcon: false,
    };

    constructor(p: CheckBoxProps) {
        super(p);

        this.state = {
            checked: !!this.props.defaultChecked,
        };
    }

    // componentDidMount() {
    //     if (this.props.defaultChecked) {
    //         this.setState({
    //             checked: true,
    //         });
    //     }
    // }

    onClick() {
        //e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        if (this.props.onChange) {
            this.props.onChange(!this.state.checked);
        }
        this.setState({
            checked: !this.state.checked,
        });
    }

    render() {
        const content = this.state.checked ? (
            <Icon
                path={this.props.outlineIcon ? mdiCheckOutline : mdiCheckBold}
            />
        ) : (
            <svg viewBox="0 0 24 24" role="presentation" />
        );
        let label;
        if (this.props.label) {
            label = <CheckBoxLabel>{this.props.label}</CheckBoxLabel>;
        } else {
            label = "";
        }

        return (
            <CheckBoxContainer>
                <CheckBoxSpan
                    ichecked={this.state.checked}
                    onClick={() => this.onClick()}
                >
                    {content}
                </CheckBoxSpan>
                {label}
            </CheckBoxContainer>
        );
    }
}

const CheckBoxContainer = styled.div`
    display: inline-block;
`;

const CheckBoxLabel = styled.p`
    display: inline-block;
`;

const CheckBoxSpan = styled.span<{ ichecked: boolean }>`
    transition: background-color 0.25s, border 0.25s;
    height: 15px;
    width: 15px;
    background-color: ${(props) =>
        props.ichecked ? props.theme.checkbox.bg : "#00000000"};
    border: 1px solid
        ${(props) =>
            props.ichecked ? "#00000000" : props.theme.checkbox.border.off};
    border-radius: 5px;
    padding: 2px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: ${(props) => props.theme.checkbox.color};

    svg {
        transition: opacity 0.25s;
        height: 15px;
        width: 15px;
        opacity: ${(props) => (props.ichecked ? "1" : "0")};
    }

    &:hover,
    &:focus {
        border: 1px solid
            ${(props) =>
                props.ichecked
                    ? "#00000000"
                    : props.theme.checkbox.border.offhover};
    }
`;
