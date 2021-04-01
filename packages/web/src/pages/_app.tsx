import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import WebClient from "src/lib/api/WebClient";
import { useStore } from "src/lib/store";
import { ClientContext } from "../components/helpers/context";
import { ApplyGlobalStyles } from "../components/helpers/styles";
import i18nConfig from "../../next-i18next.config";
import { useHotkeys } from "react-hotkeys-hook";
import { ActionType } from "../lib/action";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const s = useStore(pageProps.initialState);

    useHotkeys("ctrl+p", (e) => {
        e.preventDefault();
        s.dispatch({
            type: ActionType.PreviewToggle,
            opts: [!s.getState().mode.preview],
        });
    });

    return (
        <ClientContext.Provider
            value={{
                client: new WebClient(),
            }}
        >
            <Provider store={s}>
                <ApplyGlobalStyles>
                    <Component {...pageProps} />
                </ApplyGlobalStyles>
            </Provider>
        </ClientContext.Provider>
    );
};

export default appWithTranslation(App, i18nConfig);
