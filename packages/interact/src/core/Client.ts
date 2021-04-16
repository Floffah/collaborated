import ax, { AxiosInstance } from "axios";
import events from "events";
import ProjectStore from "../store/ProjectStore";
import API from "../api/API";
import { gql } from "@apollo/client/core";

interface ClientOptions {
    /**
     * Enable debug mode
     */
    debug?: boolean;
    /**
     * API url to use if not using the default
     */
    overrideHost?: string;
    /**
     * Whether or not to use https
     */
    useHttps?: boolean;
    /**
     * If the client is in browser mode
     */
    browserMode?: boolean;
    /**
     * Enable this to fill all data with placeholder data and not make any requests.
     * Useful for testing. This is what the collaborated frontend uses for preview mode
     */
    placeholder?: boolean;
}

export declare interface Client {
    on(event: "ready", listener: () => void): this;

    on(event: "loginprogress", listener: (progress: number) => void): this;

    on(event: string, listener: () => unknown): this;
}

export class Client extends events.EventEmitter {
    authenticated = false;
    placeholder = false;
    opts: ClientOptions;

    api: API;

    ax: AxiosInstance;

    access: string;

    host: string;

    projects: ProjectStore;

    constructor(opts: ClientOptions) {
        super();
        this.opts = opts;
        if (!opts.placeholder) {
            this.host = this.opts.overrideHost || "localhost";

            this.ax = ax.create({
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                    // 'Access-Control-Allow-Methods': "GET, POST",
                    // 'Access-Control-Allow-Headers': "Accept, Content-Type",
                    "Cache-Control": "no-cache",
                },
                baseURL: `http${this.opts.useHttps ? "s" : ""}://` + this.host,
                responseType: "json",
                //withCredentials: true,
                //transformRequest: [(data) => JSON.stringify(data)],
            });

            this.api = new API(this);
        }

        this.placeholder = opts.placeholder ?? false;
    }

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    async login(opts: LoginOptions) {
        if (Object.prototype.hasOwnProperty.call(opts, "email")) {
            opts = <DetailLoginOptions>opts;
            const d = await this.api.query({
                query: gql`
                    query Authenticate($email: String!, $password: String!) {
                        authenticate(email: $email, password: $password) {
                            access
                            refresh
                        }
                    }
                `,
                variables: {
                    email: opts.email,
                    password: opts.password,
                },
            });
            this.api.details = { access: d.data.authenticate.access, refresh: d.data.authenticate.refresh };
            console.log(this.api.details);
        } else {
            opts = <AccessLoginOptions>opts;
        }
    }

    /**
     * Check the api latency.
     * Returns -1 if the request did not succeed, otherwise, it returns the latency in millis
     */
    async ping(): Promise<number> {
        const initial = Date.now();
        let d;
        try {
            d = await this.api.query({
                query: gql`
                    query Ping {
                        ping
                    }
                `,
            });
        } catch (e) {
            return -1;
        }
        if (!d) return -1;
        if (d.data.ping !== "pong") return -1;
        return Date.now() - initial;
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
