import React from "react";
import { GroupListContainer, GroupListSeparator } from "./GroupList.styles";
import GroupListIconElement from "./GroupListIconElement";
import { mdiCog, mdiLocationEnter } from "@mdi/js";
import { useRouter } from "next/router";

export default function GroupList() {
    const r = useRouter();

    return (
        <GroupListContainer>
            <GroupListIconElement
                title="Settings"
                icon={mdiCog}
                onClick={() => r.push("/dash/settings")}
            />
            <GroupListSeparator />
            {/*Projects will go here*/}
            <GroupListSeparator />
            <GroupListIconElement
                icon={mdiLocationEnter}
                title="Join a project"
            />
        </GroupListContainer>
    );
}
