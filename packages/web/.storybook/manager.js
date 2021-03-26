import { addons } from "@storybook/addons";
import { themes } from "@storybook/theming";

addons.setConfig({
    panelPosition: "bottom",
    sidebarAnimatiosn: true,
    enableShortcuts: true,
    isToolshown: true,
    showRoots: true,
    theme: themes.dark,
});
