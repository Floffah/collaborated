import {Client} from "@collaborated/interact";

export default class TestAddon extends Client {
    constructor() {
        super({

        });
    }

    init() {
        this.start();
    }

    start() {
        this.login({
            access: "test123"
        });
    }
}
