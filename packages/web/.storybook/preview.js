import { getTheme } from "src/theme/themes";
import { withThemes } from "@react-theming/storybook-addon";
import { ThemeProvider } from "styled-components";
import { addDecorator } from "@storybook/react";
import { themes } from "@storybook/theming";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    docs: {
        theme: themes.dark,
    },
    layout: "centered",
};

const appthemes = [getTheme("dark"), getTheme("light")];

addDecorator(withThemes(ThemeProvider, appthemes));
