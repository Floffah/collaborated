import {Client} from "@collaborated/interact";
import {ColourTheme, getTheme} from "./ui/colours/theme";

export class AppContainer {
    used: boolean;

    client: Client

    theme:ColourTheme;

    popupHandler: (content: JSX.Element) => void = () => {};

    constructor(used: boolean) {
        this.used = used;
        if(used) {
            this.theme = getTheme();
        }
    }

    startClient(email: string, password: string) {
        this.client = new Client({});
        this.client.login({email,password});
    }

    handlePopups(handler: (content: JSX.Element) => void) {
        this.popupHandler = handler;
    }

    openPopup(content: JSX.Element) {
        this.popupHandler(content);
    }
}
