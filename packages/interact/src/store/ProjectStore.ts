import { Client } from "../core/Client";
import Project from "./Project";

export default class ProjectStore {
    client: Client;

    cache: Map<number, Project> = new Map();
    lastupdate = 0;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Create a project.
     * @param {string} name
     */
    async create(name: string): Promise<Project> {
        if (this.client.placeholder) {
            const p = new Project();
            p.id = 0;
            p.name = name;
            this.cache.set(p.id, p);
            return p;
        }
        const d = await this.client._query(
            "query CreateProject($name: String) { me { projects { create(name: $name) { name } } } }",
            { name },
        );

        const p = new Project();
        const proj = d.data?.data.me.projects.create;
        p.name = proj.name;
        this.cache.set(p.id, p);
        return p;
    }

    /**
     * Join a project
     * Doesn't work for an addons's client user
     * @param {string} invite
     */
    async join(invite: string): Promise<void> {
        if (this.client.placeholder) return;
        await this.client._query(
            "query JoinProject($invite: String) { me { projects { join(invite: $invite) } } }",
            { invite },
        );
        return;
    }

    /**
     * Fetch all projects associated with the user and cache them
     */
    async fetch() {
        if (this.client.placeholder) return;
        const d = await this.client._query(
            "query { me { projects { all { id name } } } }",
        );
        for (const proj of d.data.data.me.projects.all as {
            id: number;
            name: string;
        }[]) {
            const p = new Project();
            p.name = proj.name;
            p.id = proj.id;
            this.cache.set(proj.id, p);
        }
        return;
    }
}
