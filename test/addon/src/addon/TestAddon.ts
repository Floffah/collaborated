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
        //this.projects.create("test123").then((p) => {
        //     console.log(p.name);
        // });
        this.projects.fetch();
    }

    init() {
        this.start();
    }

    start() {
        // dont worry, i havent leaked anything. these are details for my local development database. the production database cluster is completely seperate!
        this.login({
            //access: "299dd2b4efb573ae7ee46665e5727bdf7c2fe0c42cb57cbcf471307400030281ea455e5493b1a1bbb399ada999e0a9b15c6ea1338fc7df8a3c70b66aef6253f9eca21daf0f2be09e6f6b3c6a1eb214305a98dd320db32c600f73d1c609dca7f75a72de58340719e4ed1c1747bdb0f12a8278153c2bd1e78cabd6256688bf28a155ec9fa70bf5fd21e7b39481ed5d1a748841629eb96f0cd0d7d238fe12743c15785ddc70397de5e7a3bba458e7926f282370db9a13dd005be5336e5183e2b8f18c32458dcf98c81918427b36a3be411a426639762001b30c98a9fbd410bed8a0c6e4bb1d7c209c6f77d110595d89b96cf93caa75a1af786f1def9278d99bbf98"
            email: "therealfloffah@gmail.com",
            password: "testpass123",
        });
    }
}
