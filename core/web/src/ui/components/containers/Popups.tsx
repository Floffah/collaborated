import * as React from "react";
import {AppContainer} from "../../../AppContainer";
import {AppContext} from "../../../util/AppContext";
import styled from "styled-components";

interface PCState {
    popups: JSX.Element[]
}

export class PopupContainer extends React.Component<any, PCState> {
    static contextType = AppContext
    appc: AppContainer;

    constructor(p: any) {
        super(p);

        this.state = {
            popups: []
        }
    }

    componentDidMount() {
        this.appc = (this.context as AppContainer);
        this.appc.handlePopups((e) => this.onPopup(e));
    }

    onPopup(content: JSX.Element) {
        console.log(content);
        this.setState({
            popups: [...this.state.popups, content]
        });
    }

    closeFirst() {
        let copy = this.state.popups;
        copy.shift();
        this.setState({
            popups: copy
        });
    }

    render() {
        let content = null;

        if(this.state.popups.length >= 1) {
            content = <div>{this.state.popups[0]}</div>
        }

        return <div>
            <Background onClick={() => this.closeFirst()} ion={content !== null}/>
            {content}
        </div>
    }
}

const Background = styled.div<{ ion: boolean }>`
    transition: opacity 0.25s;
    background-color: #000000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${props => props.ion ? "0.5" : "0"};
    pointer-events: ${props => props.ion ? "auto" : "none"};
`

export interface PopupProps {
    width?: number;
    height?: number;
}

export class Popup extends React.Component<PopupProps, any> {
    render() {
        return <PopupC iwidth={this.props.width || 300} iheight={this.props.height || 400}>
            {this.props.children}
        </PopupC>
    }
}

const PopupC = styled.div<{iwidth: number, iheight: number}>`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.iwidth}px;
    height: ${props => props.iheight}px;
`
