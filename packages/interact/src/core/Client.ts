import ax, {AxiosError, AxiosResponse} from "axios";
import {createGraphQLError, GraphQLToError} from "../util/errors";
import {SocketManager} from "../api/SocketManager";
import {EventEmitter} from "events";

interface ClientOptions {

}

export declare interface Client {
    on(event: "ready", listener: () => void): this;
    on(event: string, listener: Function): this;
}

export class Client extends EventEmitter {
    authenticated: boolean = false
    opts: ClientOptions

    socket: SocketManager

    #access: string

    url = "http://localhost/api/v1"

    constructor(opts: ClientOptions) {
        super();
        this.opts = opts;
    }

    /**
     * Send a query to the graphql api.
     * Should not be used outside of the interact library
     * @param query the query that will be executed
     * @param variables variables that will be passed to graphql
     */
    _query(query: string, variables?: { [k: string]: any }): Promise<AxiosResponse<any>> {
        return new Promise((resolve, reject) => {
            ax.post(this.url, JSON.stringify({query, variables}), {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                },
            }).then((d) => {
                if("data" in d) {
                    if("errors" in d.data) {
                        reject(GraphQLToError(createGraphQLError(d.data, query)));
                    } else {
                        resolve(d);
                    }
                } else {
                    resolve(d);
                }
            }).catch((reason:AxiosError) => {
                if(reason.response) {
                    reject(GraphQLToError(createGraphQLError(reason.response.data, query)));
                }
            });
        });
    }

    /**
     * Authenticate with the gateway using your client application's access token.
     * @param opts - login information
     */
    login(opts: LoginOptions) {
        if ("access" in opts) {
            this._query(`query Login($access: String, $listen: [String]) { me(access: $access) { gateway(listen: $listen) { url guid } } }`, {
                access: opts.access,
                listen: ["*"]
            }).then((d) => {
                this.#access = opts.access;
                this.socket = new SocketManager(d.data.data.me.gateway.url, d.data.data.me.gateway.guid, this.#access, this);
            }).catch(reason => {
                throw reason;
            });
        } else if("email" in opts && "password" in opts) {
            this._query(`query Login($password: String, $email: String) { getAccess(email: $email, password: $password) }`, {
                email: opts.email,
                password: opts.password
            }).then(d => {
                this.login({access: d.data.data.getAccess})
            }).catch(reason => {
                throw reason;
            })
        } else {
            throw new Error("Incorrect detail combination");
        }
    }
}

type LoginOptions = DetailLoginOptions | AccessLoginOptions;

interface DetailLoginOptions {
    email: string
    password: string
}

interface AccessLoginOptions {
    access: string
}

export type Incoming = IncomingError | IncomingMessage

export interface IncomingError {
    type: "error",
    error: GatewayErrors,
    errorName: string,
}

export interface IncomingMessage {
    type: "message",
    message: string,
    messageid: GatewayMessageTypes
    data: any,
}

export enum GatewayMessageTypes {
    Authenticated,
}

export enum GatewayErrors {
    InvalidAuthDetails,
    IncorrectAuthDetails,
    AuthDetailMismatch,
    CouldNotFetchUser,
    AuthenticationTimeOut
}
