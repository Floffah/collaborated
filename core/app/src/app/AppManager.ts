import Axios from "axios";
import { app, App, BrowserWindow, Tray } from "electron";
import { resolve } from "path";
import {getTrayMenu} from "../menus/trays";
import InternalServer from "../polyfill/InternalServer";

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
            this.start("http://localhost:8080");
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

    start(url?: string) {
        console.log(resolve(__dirname, "preload.ts"));
        this.win = new BrowserWindow({
            frame: false,
            minWidth: 500,
            minHeight: 400,
            center: true,
            width: 600,
            height: 500,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInSubFrames: false,
                nodeIntegrationInWorker: true,
                enableRemoteModule: true,
                preload: resolve(__dirname, "preload.js"),
                offscreen: false,
                contextIsolation: true,
            }
        });

        if(this.offline) {
            this.is = new InternalServer(this)
            this.is.init();
            this.win.loadURL("http://localhost:" + this.is.port);
        } else {
            this.win.loadURL(url || "http://localhost:80");
        }

        this.win.on("ready-to-show", () => this.win.show());
    }
}
