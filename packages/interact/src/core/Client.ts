import ax, {AxiosError, AxiosResponse} from "axios";
import {createGraphQLError, GraphQLToError} from "../util/errors";

interface ClientOptions {

}

export default class Client {
    authenticated: boolean = false
    opts: ClientOptions

    url = "http://localhost/api/v1"

    constructor(opts: ClientOptions) {
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
                console.log(JSON.stringify(d.data));
            }).catch(reason => {
                throw reason;
            });
        }
    }
}

type LoginOptions = DetailLoginOptions | AccessLoginOptions;

interface DetailLoginOptions {
    username: string
    password: string
}

interface AccessLoginOptions {
    access: string
}
