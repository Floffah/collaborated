import {GraphQLError} from "graphql";

export enum GatewayServerMessageTypes {
    Authenticated,
    Shutdown,
    Results,
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

export type IncomingMessage = IncomingQueryMessage | IncomingErrorMessage | IncomingBlankMessage

export interface IncomingQueryMessage {
    type: "message",
    message: string,
    messageid: GatewayServerMessageTypes,
    data: IncomingQueryMessageData
}

export interface IncomingQueryMessageData {
    type: "results",
    errors: GraphQLError[],
    qid: number,
    salvageable: boolean,
}

export interface IncomingErrorMessage {
    type: "error",
    error: GatewayErrors,
    errorName: string,
}

export interface IncomingBlankMessage {
    type: "message",
    message: string,
    messageid: GatewayServerMessageTypes,
    data: any,
}

export type OutgoingMessage = OutgoingQueryMessage | OutgoingBlankMessage

export interface OutgoingQueryMessage {
    type: GatewayClientMessageTypes.Query,
    data: OutgoingQueryMessageData
}

export interface OutgoingQueryMessageData {
    query: string,
    variables: { [k: string]: any },
    qid?: number,
    operationName?: string
}

export interface OutgoingBlankMessage {
    type: GatewayClientMessageTypes,
    data: { [k: string]: any }
}
