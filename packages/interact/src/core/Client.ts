import ax, { AxiosInstance } from "axios";
import events from "events";
import API, { AuthOptions } from "../api/API";
import gql from "graphql-tag";

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
     * Enable this to fill all data with placeholder data and not make any requests.
     * Useful for testing. This is what the collaborated frontend uses for preview mode
     */
    placeholder?: boolean;
    /**
     * Method of sending graphql requests
     * rest - graphql post requests (not recommended as this might break subscriptions),
     * ws - graphql websocket messages (probably has good performance),
     * auto - use rest for queries and mutations, use ws for subscriptions
     */
    method?: "rest" | "ws" | "auto";
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

    host: string;

    constructor(opts: ClientOptions) {
        super();
        this.opts = {
            debug: false,
            overrideHost: undefined,
            useHttps: true,
            method: "auto",
            ...opts,
        };
        if (!opts.placeholder) {
            if (typeof window !== "undefined") {
                this.host = this.opts.overrideHost ?? window.location.hostname; // to support localhost in dev, master.capp.floffah.dev in preview, and capp.floffah.dev in production automatically
            } else {
                this.host = this.opts.overrideHost ?? "capp.floffah.dev";
            }

            this.ax = ax.create({
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                },
                baseURL: `http${this.opts.useHttps ? "s" : ""}://` + this.host,
                responseType: "json",
            });

            this.api = new API(this);
        }

        this.placeholder = opts.placeholder ?? false;
    }

    _debug(message: () => string) {
        if (this.opts.debug) {
            console.log(message());
        }
    }

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    async login(opts: AuthOptions) {
        if (!this.placeholder) return await this.api.authenticate(opts);
    }

    /**
     * Check the api latency.
     * Returns -1 if the request did not succeed, otherwise, it returns the latency in millis
     */
    async ping(): Promise<number> {
        const initial = Date.now();
        let d;
        try {
            d = await this.api.query(gql`
                query {
                    ping
                }
            `);
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
