import React, { MouseEvent } from "react";
import { GroupListElementContainer } from "./GroupListElement.styles";
import Tooltip from "../feedback/Tooltip";

export interface PIEProps {
    title: string;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;

    children?: React.ReactNode | string;
}

export default function GroupListElement(p: PIEProps) {
    return (
        <Tooltip title={p.title} mode="hover" placement="right">
            <GroupListElementContainer onClick={p.onClick ?? undefined}>
                {p.children}
            </GroupListElementContainer>
        </Tooltip>
    );
}
