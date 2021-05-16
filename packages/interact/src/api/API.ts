import {
    ApolloClient,
    ApolloLink,
    concat,
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
import cheerio from "cheerio";
import APIError from "../errors/APIError";

export type AuthOptions = UserAuthOptions | BotAuthOptions;

export interface UserAuthOptions {
    email: string;
    password: string;
}

export interface BotAuthOptions {
    token: string;
}

export default class API {
    client: Client;

    authLink: ApolloLink;
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

    authstatus: "none" | "bot" | "user" = "none";

    details: {
        access?: string;
        refresh?: string;
        token?: string;
    } = {};

    constructor(client: Client) {
        this.client = client;
    }

    async authenticate(opts: AuthOptions) {
        if (Object.prototype.hasOwnProperty.call(opts, "token")) {
            opts = <BotAuthOptions>opts;
        }
    }

    async query(opts: QueryOptions<OperationVariables, any>) {
        if (!this.httpLink) {
            const data = await axios.get("http://" + this.client.host);

            this.urls = { gql: data.data.v1.api, socket: data.data.v1.socket };

            this.authLink = new ApolloLink((op, next) => {
                if (this.authstatus === "bot") {
                    op.setContext({
                        headers: {
                            CAPP_AUTH: `TOKEN ${this.details.token}`,
                        },
                    });
                } else if (this.authstatus === "user") {
                    op.setContext({
                        headers: {
                            CAPP_AUTH: `ACCESS ${this.details.access}`,
                        },
                    });
                }

                return next(op);
            });

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
                link: concat(this.authLink, this.splitLink),
                cache: this.cache,
            });
        }

        try {
            return await this.apollo.query(opts);
        } catch (e) {
            if (
                Object.prototype.hasOwnProperty.call(e, "message") &&
                e.message.includes("Unexpected token < in JSON") &&
                typeof e.networkError.bodyText !== "undefined"
            ) {
                //const dom = cheerio.load(e.networkError.bodyText);
                const dom = cheerio.load(e.networkError.bodyText);
                const title = dom("body .top-details .exception-info .title");
                throw new APIError(title.text());
            } else {
                throw e;
            }
        }
    }
}
