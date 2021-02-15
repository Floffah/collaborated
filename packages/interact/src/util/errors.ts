export type GraphQLErrorData = {
    [key in "errors" | "graphqlErrors"]: {
        message: string;
        locations: { line: number; column: number }[];
        path: string[];
    }[];
} & {
    data: { [k: string]: unknown };
};

export type GraphQLErrors = "unknown" | "ServerError" | "SyntaxError";

export function createGraphQLError(
    error: GraphQLErrorData,
    query?: string,
): { message: string; type: GraphQLErrors } {
    const err = error.errors[0] || error.graphqlErrors[0];
    let msg = err.message;
    let type: GraphQLErrors = "unknown";
    if (msg.startsWith("Unexpected error value")) {
        msg = msg.replace("Unexpected error value: ", "");
        const split = msg.split("");
        const first = split.shift();
        const last = split.pop();
        if (last !== '"' || first !== '"') {
            throw new Error("Malformed error data");
        }
        msg = split.join("");
        type = "ServerError";
    } else if (msg.startsWith("Syntax Error")) {
        msg = msg.replace("Syntax Error: ", "");
        type = "SyntaxError";
    }
    if (query) {
        let emsg = "";
        emsg += msg + "\n";

        const loc = err.locations[0];
        const line = query.split(/\r?\n\r?/)[loc.line - 1];
        const split = line.split("");

        emsg += "at: QUERY:" + loc.line + ":" + loc.column + "\n";

        let from = 0,
            to = 0,
            cursor = 0;

        if (loc.column > 20) {
            from = loc.column - 20;
            cursor = 20;
        } else {
            cursor = loc.column;
        }
        if (loc.column < split.length - 21) {
            to = loc.column + 20;
        } else {
            to = split.length - 1;
        }

        const part = line.substring(from, to);
        emsg += part + "\n";

        for (let i = 0; i < cursor - 1; i++) {
            emsg += " ";
        }
        emsg += "^\n";

        return {
            message: emsg,
            type,
        };
    } else {
        return {
            message: msg,
            type,
        };
    }
}

export function GraphQLToError(err: {
    message: string;
    type: GraphQLErrors;
}): Error {
    if (err.type === "SyntaxError") {
        return new SyntaxError(err.message);
    } else if (err.type == "ServerError") {
        return new ServerError(err.message);
    } else {
        return new Error(err.message);
    }
}

class ServerError extends Error {
    name = "ServerError";

    constructor(message?: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerError);
        }
    }
}
