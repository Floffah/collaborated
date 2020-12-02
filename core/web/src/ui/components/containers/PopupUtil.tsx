import * as React from "react";
import {createPopper, flip, Instance, Placement} from "@popperjs/core";

export enum PopOverPos {
    TopLeft = "top-start",
    Top = "top",
    TopRight = "top-end",
    BottomLeft = "bottom-start",
    Bottom = "bottom",
    BottomRight = "bottom-end",
    RightTop = "right-start",
    Right = "right",
    RightBottom = "right-end",
    LeftTop = "left-start",
    Left = "left",
    LeftBottom = "left-bottom",
    Auto = "auto",
    AutoLeft = "auto-left",
    AutoRight = "auto-right",
}

interface PopOverProps {
    defaultVisible?: boolean,
    content: JSX.Element,
    position?: PopOverPos,
    fit?: boolean,
    autoShow?: boolean,
}

interface PopOverState {
    visible: boolean
}

export class PopOver extends React.Component<PopOverProps, PopOverState> {
    static defaultProps:PopOverProps = {
        defaultVisible: true,
        content: <p>Hi</p>,
        position: PopOverPos.Top,
        fit: true,
        autoShow: true,
    }

    constructor(p:PopOverProps) {
        super(p);
    }

    state:PopOverState = {
        visible: !!this.props.defaultVisible
    }

    pref: React.RefObject<HTMLDivElement> = React.createRef()
    tref: React.RefObject<HTMLDivElement> = React.createRef()
    popper: Instance

    componentDidMount() {
        let shouldflip = false;
        if(this.props.fit == true) shouldflip = true;
        if(this.props.fit == undefined) shouldflip = true;

        let modifiers = [];
        if(shouldflip) modifiers.push(flip);

        this.popper = createPopper(this.pref.current as HTMLElement, this.tref.current as HTMLElement, {
            placement: this.props.position as string as Placement,
            modifiers: modifiers
        });
    }

    componentDidUpdate(prevProps: Readonly<PopOverProps>, prevState: Readonly<PopOverState>, snapshot?: any) {
        if(!!this.popper) this.popper.forceUpdate();
    }

    onClick() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        return <React.Fragment>
            <div ref={this.tref} onClick={() => this.onClick()}>
                {this.props.children}
            </div>
            <div ref={this.pref}>
                {this.props.content || <p>Hi</p>}
            </div>
        </React.Fragment>
    }
}
