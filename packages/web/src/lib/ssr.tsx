import { initializeStore } from "./store";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { Props, SST } from "src/lib/i18n";
import { PropBuilderOptions } from "./ssg";

export const getServerSideProps = async (
    p: GetServerSidePropsContext,
    ns?: string[],
): Promise<GetServerSidePropsResult<Props>> => {
    const store = initializeStore();

    return {
        props: {
            ...(await SST(p, ns)),
            initialState: store.getState(),
        },
    };
};

export const buildServerPropsFN = (opts: PropBuilderOptions) => async (
    p: GetServerSidePropsContext,
) => await getServerSideProps(p, opts.ns);
