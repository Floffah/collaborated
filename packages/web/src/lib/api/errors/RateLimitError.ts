import { ApolloError } from "apollo-server-micro";

export default class RateLimitError extends ApolloError {
    name = "RateLimitError";

    constructor(message?: string) {
        super(message ?? "Too many requests", "CLIENT_TOO_FAST");
    }
}
