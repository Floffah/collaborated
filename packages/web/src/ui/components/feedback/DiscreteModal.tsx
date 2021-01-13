import * as React from "react";
import styled from "styled-components";
import TextInput, { TextInputProps } from "../input/TextInput";

export type DiscreteModalProps =
    | DiscreteModalMessageProps
    | DiscreteModalInputProps;

interface DiscreteModalCommonProps {
    position?: "none" | "bottomRight";
    title: string;
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

        return (
            <DMContainer position={this.props.position || "bottomRight"}>
                <h2>{this.props.title}</h2>
                <DMSeperator />
                <DMContent>{content}</DMContent>
                {
                    // TODO [$5fff6a5b9cf5b300077956f0]: add buttons & close icon to DiscreteModal
                    // At the bottom right with a seperator above
                    // i think another good addition is making the lower seperator and buttons optional and not show when not used but still show the close icon
                }
            </DMContainer>
        );
    }
}

export const DMSeperator = styled.div``;
export const DMContent = styled.div``;

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
`;
