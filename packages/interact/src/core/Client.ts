import ax, {AxiosResponse} from "axios";

interface ClientOptions {

}

export default class Client {
    authenticated: boolean = false
    opts: ClientOptions

    url = "http://localhost/api/v1"

    constructor(opts: ClientOptions) {
        this.opts = opts;
    }

    _query(query: string, variables?: { [k: string]: any }): Promise<AxiosResponse<any>> {
        return ax.post(this.url, JSON.stringify({query, variables}), {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            }
        })
    }

    login(opts: LoginOptions) {
        if ("access" in opts) {
            this._query(`query Login($access: String, $listen: !String) { me(access: $access) { gateway(listen: $listen) { url guid } } }`, {
                access: opts.access,
                listen: ["*"]
            })
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
