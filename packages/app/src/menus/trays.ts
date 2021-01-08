import { Menu } from "electron";
import AppManager from "../app/AppManager";

export function getTrayMenu(app: AppManager): Menu {
    return Menu.buildFromTemplate([
        {
            label: "Exit",
            click() {
                app.app.quit();
            },
        },
    ]);
}