import styled from "styled-components";

export const TooltipArrow = styled.div`
    width: 0;
    height: 0;
    border: 7px solid transparent;
`;

export const TooltipContainer = styled.div`
    opacity: 0;
    transition: 0.1s opacity;
    pointer-events: none;
    user-select: none;
    z-index: 99999;

    &[data-popper-placement^="top"] > ${TooltipArrow} {
        bottom: -14px;
        border-top: 7px solid ${(props) => props.theme.tooltip.bg};
    }
    &[data-popper-placement^="bottom"] > ${TooltipArrow} {
        top: -14px;
        border-bottom: 7px solid ${(props) => props.theme.tooltip.bg};
    }
    &[data-popper-placement^="left"] > ${TooltipArrow} {
        right: -14px;
        border-left: 7px solid ${(props) => props.theme.tooltip.bg};
    }
    &[data-popper-placement^="right"] > ${TooltipArrow} {
        top: -14px;
        border-right: 7px solid ${(props) => props.theme.tooltip.bg};
    }
`;
export const TooltipContent = styled.div`
    background-color: ${(props) => props.theme.tooltip.bg};
    padding: 5px 10px;
    //display: inline-block;
    border-radius: 5px;

    p,
    a,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 0;
    }
`;
