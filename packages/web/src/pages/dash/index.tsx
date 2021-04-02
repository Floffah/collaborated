import React, { useEffect } from "react";
import { buildServerPropsFN } from "../../lib/ssr";
import { useClient } from "../../lib/hooks/client";
import { useRouter } from "next/router";
import Dashboard from "../../components/structures/dash/Dash";

export default function Dash() {
    const c = useClient();
    const r = useRouter();

    useEffect(() => {
        if (!c.authenticated) {
            r.push("/");
        }
    });

    return <Dashboard />;
}

export const getStaticProps = buildServerPropsFN({ ns: ["common"] });
