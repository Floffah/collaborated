import React, { forwardRef } from "react";
import { Emojis, getEmojiURL } from "../../lib/emojis";
import { getCodePoint } from "../../lib/text";

export interface EmojiProps {
    size?: string | number;
    png?: boolean;
    emoji: string | Emojis;
}

const Emoji = forwardRef<HTMLImageElement, EmojiProps>((p, ref) => {
    return (
        <img
            ref={ref}
            src={p.png ? getEmojiURL(p.emoji, "72x72") : getEmojiURL(p.emoji, "svg")}
            alt={getCodePoint(p.emoji)}
            width={p.size ?? 30}
            height={p.size ?? 30}
        />
    );
});
Emoji.displayName = "Emoji";
Emoji.defaultProps = {
    size: 30,
    png: false,
};

export default Emoji;
