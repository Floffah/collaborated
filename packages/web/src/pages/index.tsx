import React from "react";

import { Home } from "src/components/structures/Home";
import { getStaticProps as GetStaticProps } from "./ssg";

export default function Index() {
    return <Home />;
}

export const getStaticProps = GetStaticProps;
