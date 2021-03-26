import Dexie from "dexie";

export default class CollaboratedCache extends Dexie {
    basic: Dexie.Table<IBasic, string>;

    constructor() {
        super("CollaboratedCache");

        this.version(1).stores({
            basic: "++id, updated, key, value",
        });

        this.basic = this.table("basic");
    }
}

export interface IBasic {
    id?: number;
    updated: number;
    key: string;
    value: string;
}
