import React from "react"
import styled from "styled-components"

export default class Button extends React.Component {
    render() {
        return <BaseButton>{this.props.children}</BaseButton>
    }
}

const BaseButton = styled.button`
    outline: none;
    border: none;
`