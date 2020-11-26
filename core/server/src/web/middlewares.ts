import CachedMap from "../util/CachedMap";
import {NextFunction, Request, Response} from "express";
import {lstatSync, readdirSync, readFileSync} from "fs";
import {resolve} from "path";

export function staticCached(path: string) {
    let cache = new CachedMap<string>();

    console.log("caching...");

    function scan(path: string, prev: string) {
        for(let pth of readdirSync(path)) {
            let stat = lstatSync(resolve(path, pth));
            if(stat.isDirectory()) {
                scan(resolve(path, pth), prev + (prev !== "/" ? "/" : "") + pth);
            } else {
                cache.put(prev + (prev !== "/" ? "/" : "") + pth, () => {
                    return readFileSync(resolve(path, pth), "utf8");
                });
            }
        }
    }
    scan(path, "/");

    console.log("cached.");

    return (req: Request, res: Response, next: NextFunction) => {
        if(cache.has(req.path)) {
            let mime = "text/html";
            if(req.path.endsWith(".js")) {
                mime = "text/javascript"
            } else if(req.path.endsWith(".css")) {
                mime = "text/css";
            } else if(req.path.endsWith(".ico")) {
                mime = "image/vnd.microsoft.icon"
            }
            console.log(req.path, mime);
            res.status(200).header("Content-type", mime).send(cache.get(req.path));
        } else if((req.path.endsWith("/") && cache.has(req.path + "index.html"))) {
            res.status(200).send(cache.get(req.path + "index.html"));
        } else {
            next();
        }
    }
}