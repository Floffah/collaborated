import { appWithTranslation, useTranslation } from "next-i18next";
import { AppProps } from "next/app";
import React, { useState } from "react";
import { Provider } from "react-redux";
import WebClient from "src/lib/api/WebClient";
import { useStore } from "src/lib/store";
import { ClientContext } from "../components/helpers/context";
import { ApplyGlobalStyles } from "../components/helpers/styles";
import i18nConfig from "../../next-i18next.config";
import { useHotkeys } from "react-hotkeys-hook";
import { ActionType } from "../lib/action";
import { DefaultSeo } from "next-seo";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const s = useStore(pageProps.initialState);
    const [c, setc] = useState(new WebClient());
    const ts = useTranslation("seo").t;

    useHotkeys("ctrl+p", (e) => {
        e.preventDefault();
        c.placeholder = !s.getState().mode.preview;
        sessionStorage.setItem("preview", String(!s.getState().mode.preview));
        setc(c);
        s.dispatch({
            type: ActionType.PreviewToggle,
            opts: [!s.getState().mode.preview],
        });
    });

    return (
        <>
            <DefaultSeo
                titleTemplate="%s | Collaborated"
                description={ts("description")}
                openGraph={{
                    locale: pageProps._nextI18Next.initialLocale,
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
                        <Component {...pageProps} />
                    </ApplyGlobalStyles>
                </Provider>
            </ClientContext.Provider>
        </>
    );
};

export default appWithTranslation(App, i18nConfig);
