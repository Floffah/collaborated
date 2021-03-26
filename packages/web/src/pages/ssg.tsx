import { Home } from "../components/structures/Home";
import React from "react";
import { GetStaticPropsResult } from "next";
import { Props } from "./ssr";
import { initialState } from "../lib/store";

export default function SSG() {
    return <Home />;
}

export function getStaticProps(): GetStaticPropsResult<Props> {
    return {
        props: {
            initialState: initialState,
        },
    };
}
