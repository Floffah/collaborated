import ax, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { createGraphQLError, GraphQLToError } from "../util/errors";
import { SocketManager } from "../api/SocketManager";
import events from "events";
import chalk from "chalk";
import ProjectStore from "../store/ProjectStore";
import buildQuery from "../api/gql";

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

    #access: string;

    url: string;

    projects: ProjectStore;

    constructor(opts: ClientOptions) {
        super();
        this.opts = opts;
        this.url = this.opts.overrideApiURL || "http://localhost/api/v1";

        console.log(
            buildQuery({
                fields: {
                    this: {
                        fields: {
                            is: {},
                        },
                    },
                    a: {},
                },
                variables: {
                    test: "ok",
                },
            }),
        );

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
    _query(
        query: string,
        variables?: { [k: string]: any },
    ): Promise<AxiosResponse | { data: any }> {
        if (!this.socket) {
            return new Promise((resolve, reject) => {
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
                ax.post(this.url, JSON.stringify({ query, variables }), {
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
                })
                    .then((d) => {
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
                                reject(
                                    GraphQLToError(
                                        createGraphQLError(d.data, query),
                                    ),
                                );
                            } else {
                                resolve(d);
                            }
                        } else {
                            resolve(d);
                        }
                    })
                    .catch((reason: AxiosError) => {
                        if (reason.response) {
                            console.log(reason.response.data);
                            reject(
                                GraphQLToError(
                                    createGraphQLError(
                                        reason.response.data,
                                        query,
                                    ),
                                ),
                            );
                        } else {
                            console.log(reason);
                        }
                    });
            });
        } else {
            return this.socket._gateQuery(query, variables);
        }
    }

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    login(opts: LoginOptions) {
        if ("access" in opts) {
            this._query(
                `query Login($access: String, $listen: [String]) { me(access: $access) { gateway(listen: $listen) { url guid } } }`,
                {
                    access: opts.access,
                    listen: ["*"],
                },
            )
                .then((d) => {
                    this.#access = opts.access;
                    this.socket = new SocketManager(
                        d.data.data.me.gateway.url,
                        d.data.data.me.gateway.guid,
                        this.#access,
                        this,
                    );
                })
                .catch((reason) => {
                    throw reason;
                });
        } else if ("email" in opts && "password" in opts) {
            this._query(
                `query Login($password: String, $email: String) { getAccess(email: $email, password: $password) }`,
                {
                    email: opts.email,
                    password: opts.password,
                },
            )
                .then((d) => {
                    this.login({ access: d.data.data.getAccess });
                })
                .catch((reason) => {
                    throw reason;
                });
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
