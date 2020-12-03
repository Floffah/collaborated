import "source-map-support/register"
import AppManager from "./app/AppManager";

require('@electron/remote/main').initialize()
require("electron-debug")();

new AppManager()
