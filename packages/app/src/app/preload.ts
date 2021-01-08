import { Color, Titlebar } from "@treverix/custom-electron-titlebar";

window.addEventListener("DOMContentLoaded", () => {
    new Titlebar({
        backgroundColor: Color.fromHex("#141414"),
    });
});
