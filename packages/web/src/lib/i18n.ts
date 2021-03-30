import { State } from "./store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18nconfig = require("@collaborated/web/next-i18next.config.js");

export interface Props {
    initialState: State;
}

export const localeNamespaces = ["common"];

export const SST = (
    p: GetServerSidePropsContext | GetStaticPropsContext,
    ns?: string[],
) =>
    serverSideTranslations(
        p.locale as string,
        ns ?? localeNamespaces,
        i18nconfig,
    );
