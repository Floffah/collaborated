import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { useStore } from "src/lib/store";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const s = useStore(pageProps.initialState);

    return (
        <Provider store={s}>
            <Component {...pageProps} />
        </Provider>
    );
};

export default appWithTranslation(App);
