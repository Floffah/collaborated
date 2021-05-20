import { resolve } from "path";

export function getDataFolder(owner: string, name: string, roaming = false) {
    if (process.platform === "darwin") {
        return resolve(process.env.HOME as string, "Library", "Application Support", name);
    } else if (process.platform === "win32") {
        if (roaming || typeof process.env.LOCALAPPDATA !== "string") {
            return resolve(process.env.APPDATA as string, owner, name);
        } else {
            return resolve(process.env.LOCALAPPDATA as string, owner, name);
        }
    } else {
        if (typeof process.env.XDG_DATA_HOME !== "undefined") {
            return resolve(process.env.XDG_DATA_HOME, "ServerManager");
        } else {
            return resolve(process.env.HOME as string, ".local", "share", name);
        }
    }
}
