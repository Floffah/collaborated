import React, { MouseEvent } from "react";
import StyledIcon from "../util/StyledIcon";
import GroupListElement from "./GroupListElement";

export interface PLIEProps {
    title: string;
    icon: string;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function GroupListIconElement(p: PLIEProps) {
    return (
        <GroupListElement onClick={p.onClick ?? undefined} title={p.title}>
            <StyledIcon
                path={p.icon}
                style={{
                    width: 30,
                    height: 30,
                    margin: "10px 10px",
                }}
            />
        </GroupListElement>
    );
}
