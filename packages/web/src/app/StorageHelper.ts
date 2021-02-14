import { AppContainer } from "./AppContainer";
import CollaboratedSettings from "./CollaboratedSettings";
import CollaboratedCache from "./CollaboratedCache";

export default class StorageHelper {
    a: AppContainer;
    sdb: CollaboratedSettings;
    cdb: CollaboratedCache;

    constructor(a: AppContainer) {
        this.a = a;

        this.sdb = new CollaboratedSettings();
        this.cdb = new CollaboratedCache();
    }
}
