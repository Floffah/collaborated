import React, { useEffect } from "react";
import { buildServerPropsFN } from "../../lib/ssr";
import { useClient } from "../../lib/hooks/client";
import { useRouter } from "next/router";

export default function Dash() {
    const c = useClient();
    const r = useRouter();

    useEffect(() => {
        if (!c.authenticated) {
            r.push("/");
        }
    });

    return <h1>BIG EGG</h1>;
}

export const getStaticProps = buildServerPropsFN({ ns: ["common"] });
