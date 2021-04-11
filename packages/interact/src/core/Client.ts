import ax, { AxiosInstance, AxiosResponse } from "axios";
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
    useHttps: boolean;
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
                //withCredentials: true,
                transformRequest: [(data) => JSON.stringify(data.data)],
            });

            this.api = new API(this);
        }

        this.placeholder = opts.placeholder ?? false;
    }

    /**
     * Send a query to the graphql api.
     * Should not be used outside of the interact library
     * @param query the query that will be executed
     * @param variables variables that will be passed to graphql
     */
    async _query(query: string, variables?: { [k: string]: any }): Promise<AxiosResponse | { data: any }> {}

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    async login(opts: LoginOptions) {
        if (Object.prototype.hasOwnProperty.call(opts, "email")) {
            opts = <DetailLoginOptions>opts;
            this.api.query({
                query: gql`
                    query Authenticate() {
                    
                    }
                `,
            });
        } else {
            opts = <AccessLoginOptions>opts;
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
