import Icon from "@mdi/react";
import styled, { keyframes } from "styled-components";
import React from "react";
import { mdiLoading } from "@mdi/js";

export const SIcon = styled(Icon)`
    color: ${(props) => props.theme.base.color};
`;

export class LoadingIcon extends React.Component<any, { spin: number }> {
    constructor(p: any) {
        super(p);

        // this.state = {
        //     spin: 0,
        // };
    }

    // componentDidMount() {
    //     setInterval(() => {
    //         let ns = this.state.spin + 90;
    //         if (ns > 360) ns = 90;
    //         this.setState({ spin: ns });
    //     }, 250);
    // }

    render() {
        //return <LIS path={mdiLoading} rotate={this.state.spin} />;
        return <LIS path={mdiLoading} {...this.props} />;
    }
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LIS = styled(SIcon)`
    //transition: 0.25s transform linear;
    animation: ${rotate} 1s linear infinite;
`;
