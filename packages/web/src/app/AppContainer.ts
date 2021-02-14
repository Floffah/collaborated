import { Client } from "@collaborated/interact";

import semver from "semver";
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
                    await this.performUpgrade(
                        v !== undefined,
                        (v || { value: "0.0.0" }).value,
                    );
                }
            })();
        }
    }

    async performUpgrade(had: boolean, was: string) {
        this.sth.sdb.settings.put(
            { key: "lastVersion", value: this.version },
            "lastVersion",
        );
        const vh = await this.sth.sdb.settings.get("usedVersionHistory");

        if (vh !== undefined) {
            const old = JSON.parse(vh.value);
            if (!old.includes(was)) {
                this.sth.sdb.settings.put(
                    {
                        key: "usedVersionHistory",
                        value: JSON.stringify([...old, was]),
                    },
                    "usedVersionHistory",
                );
            }
        } else {
            this.sth.sdb.settings.put(
                { key: "usedVersionHistory", value: JSON.stringify([was]) },
                "usedVersionHistory",
            );
        }

        // TODO: indexeddb upgrades
        // once the frontend is at the point that it supports the per-device settings and can keep a stable cache of images, text, and other changing but requestable data i want the appcontainer/storagehelper to be able to migrate this data to new formats of indexeddb models if for example the user hasn't opened the website for a few weeks.
        // shouldn't be too hard to implement but the one thing i do not want is for this data to be completely reset because as a user i find that having to log back in and change my settings to how i like it again is incredibly frustrating and affects the relationship between the website and the user.
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
