import * as React from "react";
import styled from "styled-components";
import TextInput, { TextInputProps } from "../input/TextInput";
import Button, { BaseButton } from "../interactable/Button";

export type DiscreteModalProps =
    | DiscreteModalMessageProps
    | DiscreteModalInputProps;

interface DiscreteModalCommonProps {
    position?: "none" | "bottomRight";
    title: string;
    buttons?: string[]; // set buttons to an empty array to disable
    buttonSize?: "small" | "medium" | "large";
}

export interface DiscreteModalMessageProps extends DiscreteModalCommonProps {
    message: string;
}

export interface DiscreteModalInputProps extends DiscreteModalCommonProps {
    input: TextInputProps;
}

export default class DiscreteModal extends React.Component<
    DiscreteModalProps,
    any
> {
    static defaultProps: DiscreteModalProps = {
        position: "bottomRight",
        title: "Discrete modal title",
        message: "Discrete modal message",
        buttons: ["ok", "cancel"],
        buttonSize: "small",
    };

    constructor(p: DiscreteModalProps) {
        super(p);
    }

    render() {
        let content = <p>Something went wrong</p>;
        if (
            Object.prototype.hasOwnProperty.call(this.props, "message") &&
            "message" in this.props
        ) {
            content = <p>{this.props.message}</p>;
        } else if (
            Object.prototype.hasOwnProperty.call(this.props, "input") &&
            "input" in this.props
        ) {
            content = <TextInput {...this.props.input} />;
        }
        let bottomcontent = <></>;
        const bottombuttons: JSX.Element[] = [];

        if (
            (Array.isArray(this.props.buttons) &&
                this.props.buttons.length >= 1) ||
            this.props.buttons === undefined
        ) {
            const buttons = this.props.buttons || ["ok", "cancel"];

            for (let i = 0; i < buttons.length; i++) {
                if (i === buttons.length - 1) {
                    bottombuttons.push(
                        <Button
                            type="primary"
                            size={this.props.buttonSize || "small"}
                        >
                            {buttons[i]}
                        </Button>,
                    );
                } else {
                    bottombuttons.push(
                        <Button size={this.props.buttonSize || "small"}>
                            {buttons[i]}
                        </Button>,
                    );
                }
            }

            bottomcontent = (
                <>
                    <DMSeperator />
                    <DMButtonContainer>{bottombuttons}</DMButtonContainer>
                    <DMBottomMargin />
                </>
            );
        }

        return (
            <DMContainer position={this.props.position || "bottomRight"}>
                <h2>{this.props.title}</h2>
                <DMSeperator />
                <DMContent>{content}</DMContent>
                {
                    // TODO [#5]: add close icon to DiscreteModal
                    // A close icon from mdi that is always there and destroys the component
                }
                {bottomcontent}
            </DMContainer>
        );
    }
}

export const DMSeperator = styled.div``;
export const DMContent = styled.div``;
export const DMButtonContainer = styled.div``;
export const DMBottomMargin = styled.div``;

export const DMContainer = styled.div<{ position: "none" | "bottomRight" }>`
    position: ${(props) => (props.position === "none" ? "relative" : "fixed")};
    font-family: ${(props) => props.theme.font};
    color: ${(props) => props.theme.discreteModal.color};
    background-color: ${(props) => props.theme.discreteModal.bg};
    max-width: 350px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 5px;

    h2 {
        color: ${(props) => props.theme.discreteModal.titlecolor};
        text-align: center;
        margin-bottom: 0;
        margin-top: 15px;
    }

    ${DMSeperator} {
        height: 0;
        width: 350px;
        margin-top: 10px;
        margin-bottom: 5px;
        border: 1px solid ${(props) => props.theme.discreteModal.sepcolor};
    }

    ${DMContent} {
        p {
            text-align: center;
            margin: 0;
            margin-bottom: 5px;
        }
    }

    ${DMButtonContainer} {
        position: absolute;
        right: 0;

        ${BaseButton} {
            position: relative;
            margin-right: 5px;
        }
    }

    ${DMBottomMargin} {
        margin-bottom: 33px;
    }
`;

// TODO [#6]: better margin and button positioning on DiscreteModal
// i dont like how i am doing the bottom margin, it seems unnecessary.

// TODO [#7]: portalify discretemodal
// Currently its just a component but i want to make it portal to either the popuproot or its own root element
