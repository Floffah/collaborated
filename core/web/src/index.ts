import ui from "./ui/ui";
import {Client} from "@collaborated/interact";
import "./ui/environment.css"

let readied = false;
document.addEventListener("readystatechange", () => {
    if(!readied) {
        readied = true;
        window["client"] = new Client();
        ui();
    }
});
