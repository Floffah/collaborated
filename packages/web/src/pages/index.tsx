import React from "react";
import { Login } from "src/components/structures/Login";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { buildStaticPropsFN } from "../lib/ssg";

export default function Index() {
    const { t } = useTranslation("common");

    return (
        <div>
            <Head>
                <title>{t("login-title")} | Collaborated</title>
            </Head>
            <Login />
        </div>
    );
}

Index.defaultProps = {
    i18nNamespaces: ["common"],
};

export const getStaticProps = buildStaticPropsFN({ ns: ["common"] });
