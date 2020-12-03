import Axios from "axios";
import { app, App, BrowserWindow, Tray } from "electron";
import { resolve } from "path";
import { getTrayMenu } from "src/menus/trays";
import InternalServer from "src/polyfill/InternalServer";

export default class AppManager {
    constructor() {
        this.app.on("ready", () => this.init())
    }

    app: App = app
    win: BrowserWindow
    tray: Tray;
    devmode: boolean;
    offline: boolean;
    is: InternalServer

    media = resolve(__dirname, "../../node_modules/web/build")
    assets = resolve(__dirname, "../../assets")

    init() {
        this.tray = new Tray(resolve(this.assets, "icon.ico"));
        this.tray.setTitle("Collaborated");
        this.tray.setToolTip("Collaborated");
        this.tray.setContextMenu(getTrayMenu(this))
        Axios.get("http://localhost:8080").then((_d) => {
            this.devmode = true;
            console.log("Devmode");
            this.load("http://localhost:8080");
        }).catch((_e) => {
            this.devmode = false;
            console.log("Prodmode")
            this.load("http://localhost:80");
        });
    }

    load(url: string) {
        Axios.get(url).then((_d) => {
            this.offline = false;
            console.log("offline mode");
            this.start();
        }).catch((_e) => {
            this.offline = true;
            this.start();
            console.log("online mode");
        });
    }

    start() {
        this.win = new BrowserWindow({

        });

        if(this.offline) {
            this.is = new InternalServer(this)
            this.is.init();
            this.win.loadURL("http://localhost:" + this.is.port);
        } else {
            this.win.loadURL("http://localhost:80");
        }
    }
}