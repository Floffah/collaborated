import {
    GatewayClientMessageTypes,
    GatewayErrors,
    GatewayServerMessageTypes,
    IncomingBlankMessage,
    IncomingErrorMessage,
    IncomingMessage,
    IncomingQueryMessage,
    IncomingQueryMessageData,
    OutgoingBlankMessage,
    OutgoingMessage,
    OutgoingQueryMessage,
    OutgoingQueryMessageData,
} from "./structs/APITypes";

export { GatewayServerMessageTypes, GatewayClientMessageTypes, GatewayErrors };

export {
    IncomingMessage,
    IncomingErrorMessage,
    IncomingQueryMessage,
    IncomingBlankMessage,
    IncomingQueryMessageData,
};

export {
    OutgoingMessage,
    OutgoingQueryMessage,
    OutgoingQueryMessageData,
    OutgoingBlankMessage,
};

export const APIUrl = "http://localhost/api/v1";
