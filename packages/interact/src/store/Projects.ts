import {Client} from "../core/Client";
import Project from "./Project";
import sp from "synchronized-promise";

export default class Projects {
    client: Client

    constructor(client: Client) {
        this.client = client;
    }

    create(name: string): Promise<Project> {
        return new Promise((resolve, reject) => {
            this.client._query("query CreateProject($name: String) { me { projects { create(name: $name) { name } } } }", {name}).then((d) => {
                let p = new Project();
                p.name = d.data?.name;
                resolve(p);
            }).catch((r) => {
                reject(r);
            })
        });
    }

    // doesn't work for addons's client user
    join(invite: string) {
        this.client._query("query JoinProject($invite: String) { me { projects { join(invite: $invite) } } }", {invite}).then(d => {
            console.log(JSON.stringify(d.data));
        });
    }
}
