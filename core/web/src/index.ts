import ui from "./ui/ui";
import "./ui/environment.css";
import { AppContainer } from "./AppContainer";

let readied = false;
document.addEventListener("readystatechange", () => {
    if (!readied) {
        readied = true;
        const appc = new AppContainer(true);
        window["appc"] = appc;
        ui(appc);
    }
});
