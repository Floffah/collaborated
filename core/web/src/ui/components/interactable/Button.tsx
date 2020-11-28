import * as React from "react"
import styled from "styled-components"

interface ButtonProps {
    type?: "default"|"primary",
    onClick?: () => void,
    size?: "small"|"medium"|"large",
    className?: string,
}

export default class Button extends React.Component<ButtonProps, any> {
    static defaultProps: ButtonProps = {
        type: "default",
        onClick: undefined,
        size: "small"
    };

    render() {
        let defprop = {
            onClick: () => !!this.props.onClick ? this.props.onClick() : undefined,
            isize: 13,
            ipadding: "5px 15px 5px 15px",
            className: this.props.className
        }
        if(this.props.size === "medium") {
            defprop.isize = 15;
            defprop.ipadding = "7px 17px 7px 17px";
        } else if(this.props.size === "large") {
            defprop.isize = 17;
            defprop.ipadding = "8px 22px 8px 22px";
        }

        if(this.props.type === "primary") {
            return <PrimaryButton {...defprop}>{this.props.children}</PrimaryButton>
        }
        return <DefaultButton {...defprop}>{this.props.children}</DefaultButton>
    }
}

const BaseButton = styled.button<{isize:number,ipadding:string}>`
    outline: none;
    border: none;
    
    font-family: ${props => props.theme.font};
    padding: ${props => props.ipadding};
    border-radius: 5px;
    cursor: pointer;
    font-size: ${props => props.isize}px;
    border: none;
    
    transition: background-color 0.1s;
    
    &:focus {
        box-shadow: 0 0 0 1px ${props => props.theme.button.focus};
    }
`

const DefaultButton = styled(BaseButton)`
    color: ${props => props.theme.button.color};
    background-color: ${props => props.theme.button.bg};
    
    &:hover, &:focus {
        background-color: ${props => props.theme.button.hover};
    }
    &:active {
        background-color: ${props => props.theme.button.active || props.theme.button.bg};
    }
`

const PrimaryButton = styled(BaseButton)`
    color: ${props => props.theme.button.primary.color || props.theme.button.color};
    background-color: ${props => props.theme.button.primary.bg};
    
    &:hover, &:focus {
        background-color: ${props => props.theme.button.primary.hover};
    }
    &:active {
        background-color: ${props => props.theme.button.primary.active || props.theme.button.primary.bg};
    }
`
