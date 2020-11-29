import * as React from "react";
import {AppContainer} from "../AppContainer";
import {ThemeProvider} from "styled-components";

export const AppContext = React.createContext(new AppContainer(false));

export function AppContextProvider(props: { appcontainer: AppContainer; children: React.ReactNode; }) {
    return <ThemeProvider theme={props.appcontainer.theme}>
        <AppContext.Provider value={props.appcontainer}>
            {props.children}
        </AppContext.Provider>
    </ThemeProvider>
}
