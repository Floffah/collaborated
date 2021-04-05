import { appWithTranslation, useTranslation } from "next-i18next";
import { AppProps } from "next/app";
import React, { useState } from "react";
import { Provider } from "react-redux";
import WebClient from "src/lib/api/WebClient";
import { useStore } from "src/lib/store";
import { ClientContext } from "../components/helpers/context";
import { ApplyGlobalStyles } from "../components/helpers/styles";
import { useHotkeys } from "react-hotkeys-hook";
import { ActionType } from "../lib/action";
import { DefaultSeo } from "next-seo";
import i18nconfig from "../../next-i18next.config";

const App: React.FC<AppProps> = (p) => {
    const s = useStore(p.pageProps.initialState);
    const [c, setc] = useState(new WebClient());
    const ts = useTranslation("seo").t;

    useHotkeys(
        "ctrl+p",
        (e) => {
            e.preventDefault();
            c.placeholder = !s.getState().mode.preview;
            sessionStorage.setItem(
                "preview",
                !s.getState().mode.preview ? "true" : "false",
            );
            setc(c);
            s.dispatch({
                type: ActionType.PreviewToggle,
                opts: [!s.getState().mode.preview],
            });
        },
        {
            enableOnTags: ["INPUT"],
        },
    );

    return (
        <>
            <DefaultSeo
                titleTemplate="%s | Collaborated"
                description={ts("description")}
                openGraph={{
                    locale: p.router.locale ?? "en",
                    url: "https://capp.floffah.dev/?ref=seo",
                    title: "Collaborated",
                    description: ts("description"),
                    images: [
                        {
                            url:
                                "https://raw.githubusercontent.com/Floffah/collaborated/master/brand/collaborated(3.1).png",
                        },
                    ],
                    site_name: "Collaborated",
                }}
            />
            <ClientContext.Provider
                value={{
                    client: c,
                }}
            >
                <Provider store={s}>
                    <ApplyGlobalStyles>
                        <p.Component {...p.pageProps} />
                    </ApplyGlobalStyles>
                </Provider>
            </ClientContext.Provider>
        </>
    );
};

export default appWithTranslation(App, i18nconfig);
