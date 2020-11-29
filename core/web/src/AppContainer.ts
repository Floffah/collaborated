import {Client} from "@collaborated/interact";
import {ColourTheme, getTheme} from "./ui/colours/theme";

export class AppContainer {
    client: Client

    theme:ColourTheme;

    constructor(used: boolean) {
        if(used) {
            this.theme = getTheme();
        }
    }
}
