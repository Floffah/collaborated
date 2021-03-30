import * as React from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";

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
}

interface PopOverProps {
    defaultVisible?: boolean;
    content: React.ReactNode;
    position?: PopOverPos;
    fit?: boolean;
    autoShow?: boolean;
    contentRect?: DOMRect; // for use only if the ref isnt working (e.g. the tooltip uses it because it does funky business with this so it has to feed its own width in)
}

interface PopOverState {
    visible: boolean;
    top: number;
    left: number;
}

function getPopupRoot() {
    let root = document.getElementById("capp_popups");
    if (root === null) {
        root = document.createElement("div");
        root.setAttribute("id", "capp_popups");
        document.body.appendChild(root);
    }
    return root;
}

export class PopOver extends React.Component<PopOverProps, PopOverState> {
    static defaultProps: PopOverProps = {
        defaultVisible: true,
        content: <p>Hi</p>,
        position: PopOverPos.Top,
        fit: true,
        autoShow: true,
    };

    constructor(p: PopOverProps) {
        super(p);

        window.addEventListener("resize", () => this.recalc());
    }

    state: PopOverState = {
        visible: !!this.props.defaultVisible,
        left: 0,
        top: 0,
    };

    tref: React.RefObject<HTMLDivElement> = React.createRef();
    pref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        this.recalc();
    }

    recalc() {
        this.setState({
            top: this.calcTop(),
            left: this.calcLeft(),
        });
    }

    calcLeft(): number {
        const ppos = this.props.position || PopOverPos.Top;
        let left = 0;
        const cwidth =
            this.pref.current?.getBoundingClientRect().width ||
            this.props.contentRect?.width ||
            0;

        if (
            [PopOverPos.Top, PopOverPos.TopLeft, PopOverPos.TopRight].includes(
                ppos,
            )
        ) {
            left = this.tref.current?.getBoundingClientRect().left || 0;
            if (ppos === PopOverPos.TopLeft) {
                left +=
                    (this.tref.current?.getBoundingClientRect().width || 0) *
                    0.24;
            } else if (ppos === PopOverPos.TopRight) {
                left +=
                    (this.tref.current?.getBoundingClientRect().width || 0) *
                    0.74;
            } else {
                left +=
                    (this.tref.current?.getBoundingClientRect().width || 0) *
                    0.49;
            }
            left -= cwidth / 2;
        }

        console.log("left", left);

        return left;
    }

    calcTop(): number {
        const ppos = this.props.position || PopOverPos.Top;
        let top = 0;
        const cheight =
            this.pref.current?.getBoundingClientRect().height ||
            this.props.contentRect?.height ||
            0;

        if (
            [PopOverPos.Top, PopOverPos.TopLeft, PopOverPos.TopRight].includes(
                ppos,
            )
        ) {
            top = this.tref.current?.getBoundingClientRect().top || 0;
            top -= cheight + 2;
        }

        console.log("top", top);

        return top;
    }

    onClick() {
        if (!this.state.visible) {
            this.setState({
                visible: true,
            });
        }
    }

    onBlur() {
        if (this.state.visible) {
            this.setState({
                visible: false,
            });
        }
    }

    render() {
        let left = this.state.left;
        let top = this.state.top;

        if (this.tref.current !== null && this.pref.current !== null) {
            left = this.calcLeft();
            top = this.calcTop();
        }

        return (
            <>
                <Children
                    ref={this.tref}
                    onClick={() => this.onClick()}
                    onBlur={() => this.onBlur()}
                >
                    {this.props.children}
                </Children>
                <RootPopup
                    ref={this.pref}
                    top={top}
                    left={left}
                    visible={this.state.visible}
                >
                    {this.props.content || <p>Hi</p>}
                </RootPopup>
            </>
        );
    }
}

const Children = styled.div`
    display: inline-block;
`;

const RPS = styled.div<{ top: number; left: number; visible: boolean }>`
    transition: opacity 0.1s;
    position: fixed;
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
    //display: $\{props => props.visible ? "block" : "none"};
    opacity: ${(props) => (props.visible ? 1 : 0)};
    pointer-events: ${(props) => (props.visible ? "all" : "none")};
`;

interface RootPopupProps {
    children: React.ReactNode;
    top: number;
    left: number;
    visible: boolean;
}

const RootPopup = React.forwardRef<HTMLDivElement, RootPopupProps>((props, ref) => {
    return createPortal(
        <RPS
            ref={ref}
            top={props.top}
            left={props.left}
            visible={props.visible}
        >
            {props.children}
        </RPS>,
        getPopupRoot(),
    );
});

RootPopup.displayName = "RootPopup";
