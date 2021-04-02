import React from "react";
import { ProjectListElementContainer } from "./ProjectListElement.styles";
import StyledIcon from "../util/StyledIcon";

export interface PLIEProps {
    icon: string;
}

export default function ProjectListIconElement(p: PLIEProps) {
    return (
        <ProjectListElementContainer>
            <StyledIcon
                path={p.icon}
                style={{
                    width: 30,
                    height: 30,
                    margin: "10px 10px",
                }}
            />
        </ProjectListElementContainer>
    );
}
