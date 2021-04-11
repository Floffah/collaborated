import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
    OperationVariables,
    QueryOptions,
    split,
} from "@apollo/client";
import { Client } from "../core/Client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

export default class API {
    client: Client;

    httpLink: HttpLink;
    subLink: WebSocketLink;
    splitLink: ApolloLink;
    cache: InMemoryCache;
    apollo: ApolloClient<NormalizedCacheObject>;

    urls: {
        gql: string;
        socket: string;
    };

    constructor(client: Client) {
        this.client = client;
    }

    async query(opts: QueryOptions<OperationVariables, any>) {
        if (!this.httpLink) {
            const data = await this.client.ax.get(this.client.host);
            this.urls.gql = data.data.v1.api;
            this.urls.socket = data.data.v1.socket;

            this.httpLink = new HttpLink({
                uri: `http${this.client.opts.useHttps ? "s" : ""}://` + this.client.host + this.urls.gql, //new URL(this.urls.gql, this.client.host).toString(),
            });
            this.subLink = new WebSocketLink({
                uri: `ws://` + this.client.host + this.urls.socket,
                options: {
                    reconnect: true,
                },
            });

            this.splitLink = split(
                (q: QueryOptions) => {
                    const def = getMainDefinition(q.query);
                    return def.kind === "OperationDefinition" && def.operation == "subscription";
                },
                this.subLink,
                this.httpLink,
            );

            this.cache = new InMemoryCache();
            this.apollo = new ApolloClient({
                link: this.splitLink,
                cache: this.cache,
            });
        }

        return await this.apollo.query(opts);
    }
}
