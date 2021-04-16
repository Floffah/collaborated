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
import { getMainDefinition } from "@apollo/client/utilities";
import axios from "axios";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";

export default class API {
    client: Client;

    httpLink: HttpLink;
    subLink: WebSocketLink;
    subClient: SubscriptionClient;
    splitLink: ApolloLink;
    cache: InMemoryCache;
    apollo: ApolloClient<NormalizedCacheObject>;

    urls: {
        gql: string;
        socket: string;
    };

    details: {
        access?: string;
        refresh?: string;
    } = {};

    constructor(client: Client) {
        this.client = client;
    }

    async query(opts: QueryOptions<OperationVariables, any>) {
        if (!this.httpLink) {
            const data = await axios.get("http://" + this.client.host);

            this.urls = { gql: data.data.v1.api, socket: data.data.v1.socket };

            this.httpLink = new HttpLink({
                uri: `http${this.client.opts.useHttps ? "s" : ""}://` + this.client.host + this.urls.gql,
            });

            this.subClient = new SubscriptionClient(
                `ws://` + this.client.host + this.urls.socket,
                {
                    reconnect: true,
                    inactivityTimeout: 10000,
                    reconnectionAttempts: 3,
                },
                typeof window !== "undefined" ? WebSocket : ws,
            );
            this.subLink = new WebSocketLink(this.subClient);

            this.splitLink = split(
                (q: QueryOptions) => {
                    const def = getMainDefinition(q.query);
                    return def.kind === "OperationDefinition" && def.operation === "subscription";
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
