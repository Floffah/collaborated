export default class APIError extends Error {
    name = "APIError";

    constructor(message: string) {
        super(message);
    }
}
