import { Client } from "../core/Client";
import Project from "./Project";

export default class Projects {
    client: Client;

    cache: Map<string, Project> = new Map();
    lastupdate = 0;

    constructor(client: Client) {
        this.client = client;
    }

    async create(name: string): Promise<Project> {
        const d = await this.client._query(
            "query CreateProject($name: String) { me { projects { create(name: $name) { name } } } }",
            { name },
        );

        const p = new Project();
        const proj = d.data?.data.me.projects.create;
        p.name = proj.name;
        return p;
    }

    // doesn't work for addons's client user
    async join(invite: string): Promise<void> {
        await this.client._query(
            "query JoinProject($invite: String) { me { projects { join(invite: $invite) } } }",
            { invite },
        );
        return;
    }
}
