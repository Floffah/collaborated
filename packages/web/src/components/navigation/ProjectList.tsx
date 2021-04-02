import React from "react";
import { ProjectListContainer } from "./ProjectList.styles";
import ProjectListIconElement from "./ProjectListIconElement";
import { mdiLocationEnter } from "@mdi/js";

export default function ProjectList() {
    return (
        <ProjectListContainer>
            <ProjectListIconElement icon={mdiLocationEnter} />
        </ProjectListContainer>
    );
}
