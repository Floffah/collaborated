import ax, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
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
    ax: AxiosInstance

    #access: string

    url = "http://localhost/api/v1"

    constructor(opts: ClientOptions) {
        super();
        this.opts = opts;

        this.ax = ax.create({
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Access-Control-Allow-Origin': "*",
                // 'Access-Control-Allow-Methods': "GET, POST",
                // 'Access-Control-Allow-Headers': "Accept, Content-Type",
                'Cache-Control': "no-cache"
            },
            baseURL: this.url,
            withCredentials: true,
            transformRequest: [(data) => JSON.stringify(data.data)],
        })
    }

    /**
     * Send a query to the graphql api.
     * Should not be used outside of the interact library
     * @param query the query that will be executed
     * @param variables variables that will be passed to graphql
     */
    _query(query: string, variables?: { [k: string]: any }): Promise<AxiosResponse<any>|{data: any}> {
        if(!this.socket) {
        return new Promise((resolve, reject) => {
                ax.post(this.url, JSON.stringify({query, variables}),{
                    method: "POST",
                    data: JSON.stringify({query, variables}),
                    headers: {
                        'Content-Type': "application/json",
                        'Accept': "application/json",
                        'Access-Control-Allow-Origin': "*",
                        // 'Access-Control-Allow-Methods': "GET, POST",
                        // 'Access-Control-Allow-Headers': "Accept, Content-Type",
                        'Cache-Control': "no-cache"
                    },
                    responseType: "json",
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
                        console.log(reason.response.data);
                        reject(GraphQLToError(createGraphQLError(reason.response.data, query)));
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
    email: string
    password: string
}

interface AccessLoginOptions {
    access: string
}

export type Incoming = IncomingError | IncomingMessage | IncomingQueryReturn

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

export interface IncomingQueryReturn {
    type: "message",
    message: string,
    messageid: GatewayMessageTypes,
    data: any,
    qid: number,
}

export enum GatewayMessageTypes {
    Authenticated,
    Return,
}

export enum GatewayErrors {
    InvalidAuthDetails,
    IncorrectAuthDetails,
    AuthDetailMismatch,
    CouldNotFetchUser,
    AuthenticationTimeOut
}
