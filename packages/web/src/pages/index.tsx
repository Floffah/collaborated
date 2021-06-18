import React, { useState } from "react";
import { Login } from "src/components/structures/Login";
import { useTranslation } from "next-i18next";
import { useStore } from "react-redux";
import { Action } from "src/lib/action";
import { State } from "../lib/store";
import { NextSeo } from "next-seo";
import { buildStaticPropsFN } from "../lib/ssg";

export default function Index() {
    const { t } = useTranslation("login");
    const s = useStore<State, Action>();
    const [title, setTitle] = useState(`${t("login-title")}`);

    s.subscribe(() => {
        if (
            (s.getState().mode.preview && !title.includes("PREVIEW")) ||
            (!s.getState().mode.preview && title.includes("PREVIEW"))
        ) {
            setTitle(s.getState().mode.preview ? "PREVIEW MODE" : `${t("login-title")}`);
        }
    });

    return (
        <div>
            <NextSeo title={title} />
            <Login />
        </div>
    );
}

export const getStaticProps = buildStaticPropsFN({
    ns: ["login", "common", "seo"],
});

// export const getServerSideProps = buildStaticPropsFN({
//     ns: ["login", "common", "seo"],
// });
