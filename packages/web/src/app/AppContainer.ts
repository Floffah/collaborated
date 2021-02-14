import { Client } from "@collaborated/interact";

import * as semver from "semver";
import { ColourTheme, getTheme } from "../ui/colours/theme";
import StorageHelper from "./StorageHelper";

export class AppContainer {
    version = "0.0.1-alpha1";
    used: boolean;

    client: Client;
    sth: StorageHelper;

    theme: ColourTheme;

    popupHandler: (content: JSX.Element) => void = () =>
        console.log("unhandled popupHandler");
    notifHandler: (content: JSX.Element) => void = () =>
        console.log("unhandled notifHandler");

    constructor(used: boolean) {
        this.used = used;
        if (used) {
            this.theme = getTheme("dark");
            this.sth = new StorageHelper(this);
            (async () => {
                const v = await this.sth.sdb.settings.get("lastVersion");
                if (v === undefined || semver.lt(v.value, this.version)) {
                    this.performUpgrade(
                        v !== undefined,
                        (v || { value: "0.0.0" }).value,
                    );
                }
            })();
        }
    }

    performUpgrade(had: boolean, was: string) {
        this.sth.sdb.settings.put(
            { key: "lastVersion", value: this.version },
            "lastVersion",
        );
    }

    startClient(email: string, password: string) {
        this.client = new Client({ browserMode: true, debug: true });
        this.client.login({ email, password });
        this.client.on("ready", () => this.clientReady());
    }

    clientReady() {
        this.client.projects.fetch();
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

    loginable(): boolean {
        return !!localStorage.getItem("access");
    }
}
