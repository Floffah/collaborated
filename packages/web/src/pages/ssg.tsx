import { Login } from "../components/structures/Login";
import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { initialState } from "../lib/store";
import { Props, SST } from "src/lib/i18n";

export default function SSG() {
    return <Login />;
}

export const getStaticProps = async (
    p: GetStaticPropsContext,
    ns?: string[],
): Promise<GetStaticPropsResult<Props>> => ({
    props: {
        ...p,
        initialState: initialState,
        ...(await SST(p, ns)),
    },
});
