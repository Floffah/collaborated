import Server from "../web/Server";

// will be finished later

export default class StorageManager {
    server: Server;

    constructor(server: Server) {
        this.server = server;
    }

    queue: Queued[];
}

export interface Queued {
    relpath: string;
    data: Buffer;
}

export class QueueHelper {}
