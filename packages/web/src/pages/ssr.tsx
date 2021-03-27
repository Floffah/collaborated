import React from "react";

import { Home } from "src/components/structures/Home";
import { initializeStore } from "../lib/store";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { Props, SST } from "src/lib/i18n";

export default function SSR() {
    return <Home />;
}

export const getServerSideProps = async (
    p: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> => {
    const store = initializeStore();

    return {
        props: {
            ...p,
            initialState: store.getState(),
            ...(await SST(p)),
        },
    };
};
