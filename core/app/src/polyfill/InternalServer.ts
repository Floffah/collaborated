import express, {Application, static as estatic} from "express"
import { createServer, Server } from "http"
import { AddressInfo } from "net"
import AppManager from "../app/AppManager";

export default class InternalServer {
    port: number = 0
    app: Application

    appm: AppManager
    server: Server

    constructor(appm: AppManager) {this.appm = appm}

    init() {
        this.app = express()
        this.server = createServer(this.app)

        this.app.use("/", estatic(this.appm.media))

        this.server.listen(0);
        this.port = (this.server.address() as AddressInfo).port
    }
}
