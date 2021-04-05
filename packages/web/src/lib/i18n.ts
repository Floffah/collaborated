import { State } from "./store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";

export interface Props {
    initialState: State;
}

export const localeNamespaces = ["common"];

export const SST = (
    p: GetServerSidePropsContext | GetStaticPropsContext,
    ns?: string[],
) => serverSideTranslations(p.locale ?? "en", ns ?? localeNamespaces);
