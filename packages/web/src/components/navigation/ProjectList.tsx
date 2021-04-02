import React from "react";
import { ProjectListContainer } from "./ProjectList.styles";
import ProjectListIconElement from "./ProjectListIconElement";
import { mdiCog, mdiLocationEnter } from "@mdi/js";
import { useRouter } from "next/router";

export default function ProjectList() {
    const r = useRouter();

    return (
        <ProjectListContainer>
            <ProjectListIconElement
                icon={mdiCog}
                onClick={() => r.push("/dash/settings")}
            />
            <ProjectListIconElement icon={mdiLocationEnter} />
        </ProjectListContainer>
    );
}
