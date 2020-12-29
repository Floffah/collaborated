/**
 * This is based on the event enum. They are triggered as part of some internal service or when an endpoint like messagepush is triggered. The api class will have a subclass called EventPusher which has reusable methods that can be triggered by said endpoints by passing a value from the event enumerator.
 */

import API from "./API";

export default class EventPush {
    api: API;

    constructor(api: API) {
        this.api = api;
    }
}
