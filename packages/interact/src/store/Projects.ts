import {Client} from "../core/Client";

export default class Projects {
    client: Client

    constructor(client: Client) {
        this.client = client;
    }

    create(name: string,) {
        this.client._query("query CreateProject($name: String) { me { projects { create(name: $name) { name } } } }", {name}).then((d) => {
            console.log(d.data);
        })
    }

    // doesn't work for addons's client user
    join(invite: string) {
        this.client._query("query JoinProject($invite: String) { me { projects { join(invite: $invite) } } }", {invite}).then(d => {
            console.log(d.data);
        });
    }
}
