import React, { useState } from "react";
import { Login } from "src/components/structures/Login";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { buildStaticPropsFN } from "../lib/ssg";
import { useStore } from "react-redux";
import { Action } from "src/lib/action";
import { State } from "../lib/store";

export default function Index() {
    const { t } = useTranslation("login");
    const s = useStore<State, Action>();
    const [title, setTitle] = useState(`${t("login-title")} | Collaborated`);

    s.subscribe(() => {
        if (
            (s.getState().mode.preview && !title.includes("PREVIEW")) ||
            (!s.getState().mode.preview && !title.endsWith("Collaborated"))
        ) {
            setTitle(
                s.getState().mode.preview
                    ? "PREVIEW MODE"
                    : `${t("login-title")} | Collaborated`,
            );
        }
    });

    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <Login />
        </div>
    );
}

export const getStaticProps = buildStaticPropsFN({ ns: ["login", "common"] });
