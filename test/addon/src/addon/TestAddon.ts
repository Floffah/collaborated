import { Client } from "@collaborated/interact";

export default class TestAddon extends Client {
    constructor() {
        super({
            debug: true,
        });

        this.on("ready", () => this.ready());
    }

    ready() {
        console.log("is bonk");
    }

    init() {
        this.start();
    }

    start() {
        this.login({
            email: "therealfloffah@gmail.com",
            password: "testpassword",
        });
    }
}
