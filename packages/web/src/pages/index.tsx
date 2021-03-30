import React from "react";
import { Login } from "src/components/structures/Login";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { buildServerPropsFN } from "../lib/ssr";

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

export const getServerSideProps = buildServerPropsFN({ ns: ["common"] });
