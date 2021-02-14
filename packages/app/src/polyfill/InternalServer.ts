import { AddressInfo } from "net";
import AppManager from "../app/AppManager";
import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";

export default class InternalServer {
    port = 0;
    app: FastifyInstance & PromiseLike<any>;

    appm: AppManager;

    constructor(appm: AppManager) {
        this.appm = appm;
    }

    init() {
        this.app = fastify();

        this.app.register(fastifyStatic, {
            root: this.appm.assets,
            prefix: "/",
        });

        this.app.listen(0);
        this.port = (this.app.server.address() as AddressInfo).port;
    }
}
