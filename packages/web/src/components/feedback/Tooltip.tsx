import React, { Children, CSSProperties, useState } from "react";
import { usePopper } from "react-popper";
import { applyStyles, computeStyles, Placement } from "@popperjs/core";
import { createPortal } from "react-dom";
import {
    TooltipArrow,
    TooltipContainer,
    TooltipContent,
} from "./Tooltip.styles";
import { isBrowser } from "../../lib/context";

interface TooltipProps {
    title: string;
    children: JSX.Element;
    mode?: "hover" | "focused";
    shown?: boolean;
    placement?: Placement;
}

export default function Tooltip(props: TooltipProps) {
    const [shown, setShown] = useState(false);
    const [refp, setrefp] = useState<HTMLDivElement | null>(null);
    const [popp, setpopp] = useState<HTMLDivElement | null>(null);
    const [arrowp, setarrowp] = useState<HTMLDivElement | null>(null);
    const pop = usePopper(refp, popp, {
        strategy: "fixed",
        placement: props.placement ?? "auto",
        modifiers: [
            computeStyles,
            applyStyles,
            {
                name: "arrow",
                options: {
                    element: arrowp,
                },
            },
            {
                name: "offset",
                options: {
                    offset: [0, 15],
                },
            },
        ],
    });

    const popattrs: any = {};
    if (props.mode === "hover") {
        popattrs.onMouseEnter = () => setShown(true);
        popattrs.onMouseLeave = () => setShown(false);
    } else if (props.mode === "focused") {
        popattrs.onFocus = () => setShown(true);
        popattrs.onBlur = () => setShown(false);
    }

    const children = Children.only(props.children);

    const containerstyle: CSSProperties = {
        opacity: shown ? 1 : undefined,
        pointerEvents: shown ? "all" : undefined,
    };

    return (
        <>
            {React.cloneElement(children, { ref: setrefp, ...popattrs })}
            {isBrowser()
                ? createPortal(
                      <>
                          <TooltipContainer
                              ref={setpopp as any}
                              style={{
                                  ...pop.styles.popper,
                                  ...containerstyle,
                              }}
                              {...pop.attributes.popper}
                          >
                              <TooltipContent>
                                  <p>{props.title}</p>
                              </TooltipContent>
                              <TooltipArrow
                                  ref={setarrowp}
                                  style={pop.styles.arrow}
                                  {...pop.attributes.arrow}
                              />
                          </TooltipContainer>
                      </>,
                      getTooltipRoot(),
                  )
                : undefined}
        </>
    );
}

export function getTooltipRoot(): HTMLDivElement {
    let el = document.getElementById(
        "capp_tooltip_root",
    ) as HTMLDivElement | null;
    if (!el) {
        el = document.createElement("div");
        el.setAttribute("id", "capp_tooltip_root");
        document.body.appendChild(el);
    }
    return el;
}
