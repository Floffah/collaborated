import { Client } from "../core/Client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import ws from "ws";
import chalk from "chalk";
import { printQuery } from "../util/queries";
import {
    Client as URQLClient,
    createClient,
    defaultExchanges,
    gql,
    OperationContext,
    subscriptionExchange,
    TypedDocumentNode,
} from "urql";
import { DocumentNode, printError } from "graphql";
import { pipe, subscribe } from "wonka";

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
    subClient: SubscriptionClient;
    urql: URQLClient;

    // authLink: ApolloLink;
    // httpLink: ApolloLink;
    // subLink: WebSocketLink;
    // splitLink: ApolloLink;
    // errorLink: ApolloLink;
    // cache: InMemoryCache;
    // apollo: ApolloClient<NormalizedCacheObject>;

    apiurl: string;
    wsurl: string;

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
        if (this.details.access && this.details.refresh) {
            this.client.authenticated = true;
            this.client.emit("ready");
        } else {
            throw new Error(
                "There were no present access or refresh tokens after the authentication process and got this far so something went very wrong. Developers check sentry or the vercel serverless logs",
            );
        }
    }

    startEvents() {
        const s = this.subscribe(gql`
            subscription {
                sessionStateChange
            }
        `);
        s.subscribe((data: any) => {
            console.log(data);

            if (data && data.data) {
                if (data.data.sessionStateChange === "EXPIRE") {
                    this.refresh();
                }
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
        context?: Partial<OperationContext>,
    ) {
        this.client._debug(() => chalk`{blue MUTATE} {gray ${printQuery(mutation)}}`);
        const m = await this.urql.mutation(mutation, variables, context).toPromise();
        if (m.error) throw m.error;
        this.client._debug(() => chalk`{green MUTATE} {gray ${JSON.stringify(m.data)}}`);
        return m;
    }

    async query<Var extends Record<any, any>>(
        query: DocumentNode | TypedDocumentNode<any, Var>,
        variables?: Var,
        context?: Partial<OperationContext>,
    ) {
        this.client._debug(() => chalk`{blue QUERY} {gray ${printQuery(query)}}`);
        const m = await this.urql.query(query, variables, context).toPromise();
        if (m.error) throw m.error;
        this.client._debug(() => chalk`{green QUERY} {gray ${JSON.stringify(m.data)}}`);
        return m;
    }

    subscribe<Var extends Record<any, any>>(
        subscription: DocumentNode | TypedDocumentNode<any, Var>,
        variables?: Var,
        context?: Partial<OperationContext>,
    ) {
        this.client._debug(() => chalk`{green SUBSCRIBE} {gray ${printQuery(subscription)}}`);
        const sub = this.urql.subscription(subscription, variables, context);
        return {
            subscribe: (...args: Parameters<typeof subscribe>) => {
                return pipe(sub, subscribe(...args));
            },
        };
    }

    async init() {
        //const data = await axios.get("http://" + this.client.host);
        if (this.client.host === "localhost:3000" || !this.client.opts.useHttps) {
            this.apiurl = `http://${this.client.host}/api/graphql`;
        } else {
            this.apiurl = `https://${this.client.host}/api/graphql`;
        }

        if (this.apiurl.startsWith("https")) {
            this.wsurl = this.apiurl.replace(/^https?/, "wss");
        } else {
            this.wsurl = this.apiurl.replace(/^https?/, "ws");
        }

        this.subClient = new SubscriptionClient(
            this.wsurl,
            {
                reconnect: true,
                reconnectionAttempts: 3,
                timeout: 3000,
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
            typeof document !== "undefined" ? WebSocket : ws,
        );
        this.urql = createClient({
            url: this.apiurl,
            fetchOptions: () => {
                const opts: RequestInit = {};

                if (this.authstatus === "bot" && typeof this.details.token !== "undefined") {
                    opts.headers = {};
                    opts.headers["CAPP_AUTH"] = `TOKEN ${this.details.token}`;
                } else if (this.authstatus === "user" && typeof this.details.access !== "undefined") {
                    opts.headers = {};
                    opts.headers["CAPP_AUTH"] = `ACCESS ${this.details.access}`;
                }

                return opts;
            },
            exchanges: [
                ...defaultExchanges,
                subscriptionExchange({
                    forwardSubscription: (op) => this.subClient.request(op),
                }),
            ],
        });
    }
}
