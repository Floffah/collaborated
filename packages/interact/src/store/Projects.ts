import { Client } from "../core/Client";
import Project from "./Project";

export default class Projects {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    create(name: string): Promise<Project> {
        return new Promise((resolve, reject) => {
            this.client
                ._query(
                    "query CreateProject($name: String) { me { projects { create(name: $name) { name } } } }",
                    { name },
                )
                .then((d) => {
                    const p = new Project();
                    const proj = d.data?.data.me.projects.create;
                    p.name = proj.name;
                    resolve(p);
                })
                .catch((r) => reject(r));
        });
    }

    // doesn't work for addons's client user
    join(invite: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client
                ._query(
                    "query JoinProject($invite: String) { me { projects { join(invite: $invite) } } }",
                    { invite },
                )
                .then(() => {
                    resolve();
                })
                .catch((r) => reject(r));
        });
    }
}
