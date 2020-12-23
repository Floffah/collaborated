import {GraphQLError} from "graphql";

export enum GatewayServerMessageTypes {
    Authenticated,
    Shutdown,
}

export enum GatewayClientMessageTypes {
    Authenticate = "auth",
    Query = "query",
}

export enum GatewayErrors {
    InvalidAuthDetails,
    IncorrectAuthDetails,
    AuthDetailMismatch,
    CouldNotFetchUser,
    AuthenticationTimeOut
}

export interface ServerResponse {
    type: "results" | "unknown"
    errors?: GraphQLError[],
    qid?: any,
    data?: any,
    salvageable?: boolean,
}
