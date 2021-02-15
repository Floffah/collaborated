import ax, { AxiosInstance, AxiosResponse } from "axios";
import { createGraphQLError, GraphQLToError } from "../util/errors";
import { SocketManager } from "../api/SocketManager";
import events from "events";
import chalk from "chalk";
import ProjectStore from "../store/ProjectStore";

interface ClientOptions {
    debug?: boolean;
    overrideApiURL?: string;
    browserMode?: boolean;
}

export declare interface Client {
    on(event: "ready", listener: () => void): this;

    on(event: string, listener: () => unknown): this;
}

export class Client extends events.EventEmitter {
    authenticated = false;
    opts: ClientOptions;

    socket: SocketManager;
    ax: AxiosInstance;

    access: string;

    url: string;

    projects: ProjectStore;

    constructor(opts: ClientOptions) {
        super();
        this.opts = opts;
        this.url = this.opts.overrideApiURL || "http://localhost/api/v1";

        this.ax = ax.create({
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                // 'Access-Control-Allow-Methods': "GET, POST",
                // 'Access-Control-Allow-Headers': "Accept, Content-Type",
                "Cache-Control": "no-cache",
            },
            baseURL: this.url,
            withCredentials: true,
            transformRequest: [(data) => JSON.stringify(data.data)],
        });
    }

    /**
     * Send a query to the graphql api.
     * Should not be used outside of the interact library
     * @param query the query that will be executed
     * @param variables variables that will be passed to graphql
     */
    async _query(
        query: string,
        variables?: { [k: string]: any },
    ): Promise<AxiosResponse | { data: any }> {
        if (!this.socket) {
            if (this.opts.debug) {
                console.log(
                    chalk`{red -} {blue REQUEST WITH QUERY} {gray "${query}"} ${
                        variables
                            ? chalk`{blue WITH VARIABLES} {gray ${JSON.stringify(
                                  variables,
                              )}}`
                            : ""
                    } {blue WITH NO QID}`,
                );
            }
            const start = Date.now();
            let d;
            try {
                d = await ax.post(
                    this.url,
                    JSON.stringify({ query, variables }),
                    {
                        method: "POST",
                        data: JSON.stringify({ query, variables }),
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "Access-Control-Allow-Origin": "*",
                            // 'Access-Control-Allow-Methods': "GET, POST",
                            // 'Access-Control-Allow-Headers': "Accept, Content-Type",
                            "Cache-Control": "no-cache",
                        },
                        responseType: "json",
                    },
                );
            } catch (reason) {
                if (reason.response) {
                    console.log(reason.response.data);
                    throw GraphQLToError(
                        createGraphQLError(reason.response.data, query),
                    );
                } else {
                    throw reason;
                }
            }
            if (d === undefined) throw "Request was undefined";
            if (this.opts.debug) {
                console.log(
                    chalk`{green -} {blue REQUEST QUERY RETURN} {gray ${JSON.stringify(
                        d.data,
                    )}} {blue WITH ${
                        d.data.qid ? "QID " + d.data.qid : "NO QID"
                    } IN ${Date.now() - start}ms}`,
                );
            }
            if ("data" in d) {
                if ("errors" in d.data) {
                    throw GraphQLToError(createGraphQLError(d.data, query));
                } else {
                    return d;
                }
            } else {
                return d;
            }
        } else {
            return await this.socket._gateQuery(query, variables);
        }
    }

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    async login(opts: LoginOptions) {
        if ("access" in opts) {
            const d = await this._query(
                `query Login($access: String, $listen: [String]) { me(access: $access) { gateway(listen: $listen) { url guid } } }`,
                {
                    access: opts.access,
                    listen: ["*"],
                },
            );
            this.access = opts.access;
            this.socket = new SocketManager(
                d.data.data.me.gateway.url,
                d.data.data.me.gateway.guid,
                this.access,
                this,
            );
        } else if ("email" in opts && "password" in opts) {
            const d = await this._query(
                `query Login($password: String, $email: String) { getAccess(email: $email, password: $password) }`,
                {
                    email: opts.email,
                    password: opts.password,
                },
            );
            await this.login({ access: d.data.data.getAccess });
        } else {
            throw new Error("Incorrect detail combination");
        }
    }
}

export function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

type LoginOptions = DetailLoginOptions | AccessLoginOptions;

interface DetailLoginOptions {
    email: string;
    password: string;
}

interface AccessLoginOptions {
    access: string;
}
