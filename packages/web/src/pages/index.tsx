import React from "react";

import { Login } from "src/components/structures/Login";
import { getStaticProps as GetStaticProps } from "./ssg";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function Index() {
    const { t } = useTranslation("common");

    return (
        <div>
            <Head>
                <title>{t("login-title")}</title>
            </Head>
            <Login />
        </div>
    );
}

export const getStaticProps = GetStaticProps;
