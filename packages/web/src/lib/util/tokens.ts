import cryptoRandomString from "crypto-random-string";

export function generateUserTokens() {
    return {
        access: cryptoRandomString({ length: 256, type: "alphanumeric" }),
        refresh: cryptoRandomString({ length: 128, type: "alphanumeric" }),
    };
}
