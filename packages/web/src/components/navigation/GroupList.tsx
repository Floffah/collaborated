import React from "react";
import { GroupListContainer, GroupListSeparator } from "./GroupList.styles";
import GroupListIconElement from "./GroupListIconElement";
import { mdiCog, mdiLocationEnter } from "@mdi/js";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function GroupList() {
    const r = useRouter();
    const tc = useTranslation("common").t;

    return (
        <GroupListContainer>
            <GroupListIconElement
                title={tc("settings")}
                icon={mdiCog}
                onClick={() => r.push("/dash/settings")}
            />
            <GroupListSeparator />
            {/*Projects will go here*/}
            <GroupListSeparator />
            <GroupListIconElement
                icon={mdiLocationEnter}
                title={tc("joinproj")}
            />
        </GroupListContainer>
    );
}
