import * as React from "react"
import styled from "styled-components"

interface ButtonProps {

}

export default class Button extends React.Component<any, ButtonProps> {
    render() {
        return <BaseButton>{this.props.children}</BaseButton>
    }
}

const BaseButton = styled.button`
    outline: none;
    border: none;
    
    font-family: ${props => props.theme.font};
    padding: 5px 15px 5px 15px;
    border-radius: 5px;
    cursor: pointer;
`
