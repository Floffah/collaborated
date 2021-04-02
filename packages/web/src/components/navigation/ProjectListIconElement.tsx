import React, { MouseEvent } from "react";
import StyledIcon from "../util/StyledIcon";
import ProjectListElement from "./ProjectListElement";

export interface PLIEProps {
    icon: string;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function ProjectListIconElement(p: PLIEProps) {
    return (
        <ProjectListElement onClick={p.onClick ?? undefined}>
            <StyledIcon
                path={p.icon}
                style={{
                    width: 30,
                    height: 30,
                    margin: "10px 10px",
                }}
            />
        </ProjectListElement>
    );
}
