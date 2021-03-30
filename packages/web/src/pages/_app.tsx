import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import WebClient from "src/lib/api/WebClient";
import { useStore } from "src/lib/store";
import { ClientContext } from "../components/helpers/context";
import { ApplyGlobalStyles } from "../components/helpers/styles";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const s = useStore(pageProps.initialState);

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

export default appWithTranslation(App);
