import { Client } from "@collaborated/interact";
import { ColourTheme, getTheme } from "./ui/colours/theme";

export class AppContainer {
    used: boolean;

    client: Client;

    theme: ColourTheme;

    popupHandler: (content: JSX.Element) => void = () =>
        console.log("unhandled popupHandler");
    notifHandler: (content: JSX.Element) => void = () =>
        console.log("unhandled notifHandler");

    constructor(used: boolean) {
        this.used = used;
        if (used) {
            this.theme = getTheme("dark");
        }
    }

    startClient(email: string, password: string) {
        this.client = new Client({ browserMode: true });
        this.client.login({ email, password });
    }

    handlePopups(handler: (content: JSX.Element) => void) {
        this.popupHandler = handler;
    }

    handleNotifs(handler: (content: JSX.Element) => void) {
        this.notifHandler = handler;
    }

    openPopup(content: JSX.Element) {
        this.popupHandler(content);
    }

    showNotif(content: JSX.Element) {
        this.notifHandler(content);
    }
}
