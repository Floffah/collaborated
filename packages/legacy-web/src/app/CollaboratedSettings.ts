import Dexie from "dexie";

export default class CollaboratedSettings extends Dexie {
    settings: Dexie.Table<ISettings, string>;
    limited: Dexie.Table<ILimited, string>;

    constructor() {
        super("CollaboratedSettings");

        this.version(1).stores({
            settings: "key, value",
            limited: "key, value, created, sessioned",
        });

        this.settings = this.table("settings");
        this.limited = this.table("limited");
    }
}

export interface ISettings {
    key: string;
    value: string;
}

export interface ILimited {
    key: string;
    value: string;
    created: number;
    sessioned: boolean;
}
