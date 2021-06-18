import React, { useEffect } from "react";
import { useClient } from "../../lib/hooks/client";
import { useRouter } from "next/router";
import Dashboard from "../../components/structures/dash/Dash";
import { buildStaticPropsFN } from "../../lib/ssg";

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

export const getStaticProps = buildStaticPropsFN({ ns: ["common"] });

// export const getServerSideProps = buildServerPropsFN({
//     ns: ["common"],
// });
