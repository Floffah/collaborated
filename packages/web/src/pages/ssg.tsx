import { Home } from "../components/structures/Home";
import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { initialState } from "../lib/store";
import { Props, SST } from "src/lib/i18n";

export default function SSG() {
    return <Home />;
}

export const getStaticProps = async (
    p: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> => ({
    props: {
        ...p,
        initialState: initialState,
        ...(await SST(p)),
    },
});
