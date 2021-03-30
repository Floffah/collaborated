import { State } from "./store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { resolve } from "path";

export interface Props {
    initialState: State;
}

export const localeNamespaces = ["common"];

export const SST = (
    p: GetServerSidePropsContext | GetStaticPropsContext,
    ns?: string[],
) =>
    serverSideTranslations(p.locale as string, ns ?? localeNamespaces, {
        localePath: resolve("./public/locale"),
        defaultNS: "common",
        i18n: {
            locales: ["en"],
            defaultLocale: "en",
        },
    });
