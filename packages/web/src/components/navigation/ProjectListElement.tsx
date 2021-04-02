import React, { MouseEvent } from "react";
import { ProjectListElementContainer } from "./ProjectListElement.styles";

export interface PIEProps {
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;

    children?: React.ReactNode | string;
}

export default function ProjectListElement(p: PIEProps) {
    return (
        <ProjectListElementContainer onClick={p.onClick ?? undefined}>
            {p.children}
        </ProjectListElementContainer>
    );
}
