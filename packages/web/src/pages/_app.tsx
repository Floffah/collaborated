import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { useStore } from "src/lib/store";

const App: React.FC<AppProps> = (p) => {
    const s = useStore(p.pageProps.initialState);

    return (
        <Provider store={s}>
            <p.Component {...p.pageProps} />
        </Provider>
    );
};

export default App;
