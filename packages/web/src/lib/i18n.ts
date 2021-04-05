import { State } from "./store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import * as i18nconfig from "../../next-i18next.config";

export interface Props {
    initialState: State;
}

export const localeNamespaces = ["common"];

export const SST = (
    p: GetServerSidePropsContext | GetStaticPropsContext,
    ns?: string[],
) =>
    serverSideTranslations(
        p.locale ?? "en",
        ns ?? localeNamespaces,
        i18nconfig,
    );
