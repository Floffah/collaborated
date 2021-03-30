import * as React from "react";
import { RefObject } from "react";
import { PopOver, PopOverPos } from "../containers/PopupUtil";
import styled from "styled-components";
import { getTheme } from "../../colours/theme";

export interface TooltipProps {
    message: string;
    position: PopOverPos;
}

interface TooltipState {
    visible: boolean;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
    static defaultProps: TooltipProps = {
        message: "This is a tooltip",
        position: PopOverPos.Top,
    };

    constructor(p: TooltipProps) {
        super(p);

        this.state = {
            visible: false,
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    cref: RefObject<HTMLDivElement> = React.createRef();

    render() {
        const content = (
            <TooltipMessage
                contentRef={this.cref}
                message={this.props.message}
            />
        );

        return (
            <PopOver
                content={content}
                defaultVisible={false}
                position={this.props.position}
                contentRect={this.cref.current?.getBoundingClientRect()}
            >
                {this.props.children}
            </PopOver>
        );
    }
}

export interface TooltipMProps {
    message: string;
    contentRef?: RefObject<HTMLDivElement>;
}

interface TooltipMState {
    arrowtop: number;
    arrowlft: number;
    cwidth?: number;
}

const theme = getTheme();

export class TooltipMessage extends React.Component<
    TooltipMProps,
    TooltipMState
> {
    constructor(p: any) {
        super(p);

        this.state = {
            arrowlft: 0,
            arrowtop: 0,
        };
    }

    cref: RefObject<HTMLDivElement> = React.createRef();
    mref: RefObject<HTMLParagraphElement> = React.createRef();

    componentDidMount() {
        this.setState({
            arrowlft: 10, //(this.cref.current?.getBoundingClientRect().width as number) - 10,
            arrowtop: this.cref.current?.getBoundingClientRect()
                .height as number,
        });
        this.calcWidth();
    }

    calcWidth() {
        const temp = document.createElement("canvas");
        const ctx = temp.getContext("2d");
        if (ctx) {
            ctx.font =
                theme.font ??
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
            this.setState(
                {
                    cwidth:
                        (this.mref.current?.getBoundingClientRect()
                            .width as number) + 10, //ctx.measureText(this.props.message).width
                },
                () => {
                    temp.parentElement?.removeChild(temp);
                },
            );
        }
    }

    render() {
        return (
            <TMEnclosure
                ref={this.props.contentRef || undefined}
                pwidth={this.state.cwidth || "auto"}
            >
                <TMContainer ref={this.cref}>
                    <TMMessage ref={this.mref}>{this.props.message}</TMMessage>
                </TMContainer>
                <TMArrow
                    ptop={this.state.arrowtop}
                    pleft={this.state.arrowlft}
                />
            </TMEnclosure>
        );
    }
}

const TMArrow = styled.div<{ ptop: number; pleft: number }>`
    content: "";
    width: 0;
    height: 0;
    position: relative;
    left: calc(50% - 10px);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid ${(props) => props.theme.tooltip.bg};
`;

const TMContainer = styled.div`
    padding: 5px;
    background-color: ${(props) => props.theme.tooltip.bg};
    position: relative;
`;

const TMMessage = styled.p`
    margin: 0;
    width: auto;
    height: auto;
`;

const TMEnclosure = styled.div<{ pwidth: number | string }>`
    position: fixed;
    color: ${(props) => props.theme.tooltip.color};
    width: ${(props) => props.pwidth}px;
    font-family: ${(props) => props.theme.font};
    font-size: 15px;
    z-index: 1000;

    ${TMContainer} {
        width: ${(props) => props.pwidth};
    }
`;
