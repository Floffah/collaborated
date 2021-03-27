import React from "react";

import { Login } from "src/components/structures/Login";
import { initializeStore } from "../lib/store";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { Props, SST } from "src/lib/i18n";

export default function SSR() {
    return <Login />;
}

export const getServerSideProps = async (
    p: GetServerSidePropsContext,
    ns?: string[],
): Promise<GetServerSidePropsResult<Props>> => {
    const store = initializeStore();

    return {
        props: {
            ...p,
            initialState: store.getState(),
            ...(await SST(p, ns)),
        },
    };
};
