import { themes } from "@storybook/theming";
import { getTheme } from "../src/ui/colours/theme";
import { withThemesProvider } from "themeprovider-storybook";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    docs: {
        theme: themes.dark,
    },
};

const appthemes = [getTheme("dark"), getTheme("light")];

export const decorators = [withThemesProvider(appthemes)];
