import {
    ApolloClient,
    ApolloLink,
    concat,
    DocumentNode,
    HttpLink,
    InMemoryCache,
    MutationOptions,
    NormalizedCacheObject,
    QueryOptions,
    split,
    TypedDocumentNode,
} from "@apollo/client";
import { Client } from "../core/Client";
import { getMainDefinition } from "@apollo/client/utilities";
import axios from "axios";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";
import { gql } from "@apollo/client/core";
import chalk from "chalk";
import { printQuery } from "../util/queries";

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
        await this.init();
        if (Object.prototype.hasOwnProperty.call(opts, "token")) {
            opts = <BotAuthOptions>opts;
            this.authstatus = "bot";
            this.details.token = opts.token;
        } else {
            opts = <UserAuthOptions>opts;
            this.authstatus = "user";
            const deets = await this.mutate(
                gql`
                    mutation GetTokens($email: String!, $password: String!) {
                        getTokens(email: $email, password: $password) {
                            access
                            refresh
                        }
                    }
                `,
                {
                    email: opts.email,
                    password: opts.password,
                },
            );
            if (typeof deets.data.getTokens.access === "undefined") throw "Could not fetch tokens";
            this.details.access = deets.data.getTokens.access;
            this.details.refresh = deets.data.getTokens.refresh;
        }
        this.startEvents();
    }

    startEvents() {
        const s = this.subscribe(gql`
            subscription {
                sessionStateChange
            }
        `);
        s.subscribe((data) => {
            if (data.data.sessionStateChange === "EXPIRE") {
                this.refresh();
            }
        });
    }

    async refresh() {
        if (this.authstatus !== "user") throw "Only users can refresh";
        const res = await this.mutate(
            gql`
                mutation Refresh($access: String!, $refresh: String!) {
                    refresh(access: $access, refresh: $refresh) {
                        access
                        refresh
                    }
                }
            `,
            {
                access: this.details.access,
                refresh: this.details.refresh,
            },
        );

        this.details.refresh = res.data.refresh.refresh;
        this.details.access = res.data.access.access;
    }

    async mutate<Var extends Record<any, any>>(
        mutation: DocumentNode | TypedDocumentNode<any, Var>,
        variables?: Var,
        opts?: MutationOptions<any, Var>,
    ) {
        this.client._debug(() => chalk`{blue MUTATE} {gray ${printQuery(mutation)}}`);
        const m = await this.apollo.mutate({
            mutation,
            variables,
            ...opts,
        });
        this.client._debug(() => chalk`{green MUTATE} {gray ${JSON.stringify(m.data)}}`);
        return m;
    }

    async query<Var extends Record<any, any>>(
        query: DocumentNode | TypedDocumentNode<any, Var>,
        variables?: Var,
        opts?: QueryOptions<any, Var>,
    ) {
        this.client._debug(() => chalk`{blue QUERY} {gray ${printQuery(query)}}`);
        const m = await this.apollo.query({
            query,
            variables,
            ...opts,
        });
        this.client._debug(() => chalk`{green QUERY} {gray ${JSON.stringify(m.data)}}`);
        return m;
    }

    subscribe<Var extends Record<any, any>>(
        subscription: DocumentNode | TypedDocumentNode<any, Var>,
        variables?: Var,
        opts?: MutationOptions<any, Var>,
    ) {
        this.client._debug(() => chalk`{green SUBSCRIBE} {gray ${printQuery(subscription)}}`);
        return this.apollo.subscribe({
            query: subscription,
            variables,
            ...opts,
        });
    }

    async init() {
        const data = await axios.get("http://" + this.client.host);

        this.urls = { gql: data.data.v1.api, socket: data.data.v1.socket };

        if (this.client.opts.method === "rest" || this.client.opts.method === "auto") {
            this.authLink = new ApolloLink((op, next) => {
                if (this.authstatus === "bot" && typeof this.details.token !== "undefined") {
                    op.setContext({
                        headers: {
                            CAPP_AUTH: `TOKEN ${this.details.token}`,
                        },
                    });
                } else if (this.authstatus === "user" && typeof this.details.access !== "undefined") {
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
        }

        if (this.client.opts.method === "ws" || this.client.opts.method === "auto") {
            this.subClient = new SubscriptionClient(
                `ws://` + this.client.host + this.urls.socket,
                {
                    reconnect: true,
                    inactivityTimeout: 10000,
                    reconnectionAttempts: 3,
                    connectionParams: () => {
                        if (this.authstatus === "bot") {
                            return {
                                capp_auth: `TOKEN ${this.details.token}`,
                            };
                        } else if (this.authstatus === "user") {
                            return {
                                capp_auth: `ACCESS ${this.details.access}`,
                            };
                        } else {
                            return {};
                        }
                    },
                },
                typeof window !== "undefined" ? WebSocket : ws,
            );
            this.subLink = new WebSocketLink(this.subClient);
        }

        if (this.client.opts.method === "auto") {
            this.splitLink = split(
                (q: QueryOptions) => {
                    const def = getMainDefinition(q.query);
                    return def.kind === "OperationDefinition" && def.operation === "subscription";
                },
                this.subLink,
                this.httpLink,
            );
        }

        let finalLink;
        if (this.client.opts.method === "auto") {
            finalLink = this.splitLink;
        } else if (this.client.opts.method === "rest") {
            finalLink = concat(this.authLink, this.httpLink);
        } else if (this.client.opts.method === "ws") {
            finalLink = this.subLink;
        }

        this.cache = new InMemoryCache();
        this.apollo = new ApolloClient({
            link: finalLink,
            cache: this.cache,
        });
    }
}
