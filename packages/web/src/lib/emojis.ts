import { getCodePoint } from "./text";

export const TwemojiVersion = "13.0.2";
export const TwemojiURL = `https://twemoji.maxcdn.com/v/${TwemojiVersion}`;

export function getEmojiURL(emoji: string, type: "svg" | "72x72" = "svg"): string {
    if (type === "72x72") {
        return `${TwemojiURL}/72x72/${getCodePoint(emoji)}.png`;
    }
    return `${TwemojiURL}/svg/${getCodePoint(emoji)}.svg`;
}

export enum Emojis {
    grinning = "😀",
    // will add more later
}
