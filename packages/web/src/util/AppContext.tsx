import * as React from "react";
import { AppContainer } from "../AppContainer";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { i18n } from "i18next";

export const AppContext = React.createContext(new AppContainer(false));

export function AppContextProvider(props: {
    appcontainer: AppContainer;
    children: React.ReactNode;
    i18next: i18n;
}) {
    return (
        <React.StrictMode>
            <I18nextProvider i18n={props.i18next}>
                <ThemeProvider theme={props.appcontainer.theme}>
                    <AppContext.Provider value={props.appcontainer}>
                        {props.children}
                    </AppContext.Provider>
                </ThemeProvider>
            </I18nextProvider>
        </React.StrictMode>
    );
}
