import React from "react";
import {
    createGlobalStyle,
    ThemeProps,
    ThemeProvider,
} from "styled-components";
import { State } from "../../lib/store";
import { useStore } from "react-redux";
import { getTheme, Theme } from "../../theme/themes";

const GlobalStyles = createGlobalStyle<ThemeProps<Theme>>`
  body, html {
    position: absolute;
    margin: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    font-family: ${(props) => props.theme.font};
    background-color: ${(props) => props.theme.pagebg};
  }

  p, span {
    color: ${(props) => props.theme.text?.defaultColor};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.text?.defaultHeaderColor};
  }
  
  a {
    color: ${(props) => props.theme.links?.color};
    cursor: pointer;
  }
  a:active {
    color: ${(props) => props.theme.links?.active};
  }
`;

export const ApplyGlobalStyles: React.FC = (p) => {
    const state = useStore<State>();
    const s = state.getState();

    return (
        <>
            <ThemeProvider theme={getTheme(s.theme)}>
                <GlobalStyles />
                {p.children}
            </ThemeProvider>
        </>
    );
};
