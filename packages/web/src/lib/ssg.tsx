import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { initialState } from "./store";
import { Props, SST } from "src/lib/i18n";

export const getStaticProps = async (
    p: GetStaticPropsContext,
    ns?: string[],
): Promise<GetStaticPropsResult<Props>> => ({
    props: {
        initialState: initialState,
        ...(await SST(p, ns)),
    },
});

export interface PropBuilderOptions {
    ns?: string[];
}

export const buildStaticPropsFN = (opts: PropBuilderOptions) => async (
    p: GetStaticPropsContext,
) => await getStaticProps(p, opts.ns);
