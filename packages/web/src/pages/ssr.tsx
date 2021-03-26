import React from "react";

import { Home } from "src/components/structures/Home";
import { initializeStore, State } from "../lib/store";
import { GetServerSidePropsResult } from "next";

export default function SSR() {
    return <Home />;
}

export interface Props {
    initialState: State;
}

export function getServerSideProps(): GetServerSidePropsResult<Props> {
    const store = initializeStore();

    return {
        props: {
            initialState: store.getState(),
        },
    };
}
