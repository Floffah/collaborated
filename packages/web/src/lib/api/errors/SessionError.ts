import { ApolloError } from "apollo-server-micro";

export default class SessionError extends ApolloError {
    name = "SessionError";

    constructor(message: string) {
        super(message, "SESSION_ERROR");
    }
}
