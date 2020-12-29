import "source-map-support/register";
import AppManager from "./app/AppManager";

// these ignores are because there is no other way
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@electron/remote/main").initialize();
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("electron-debug")();

new AppManager();
