import { Client } from "@collaborated/interact";

export default class WebClient extends Client {
    constructor() {
        super({ debug: true });
    }
}
