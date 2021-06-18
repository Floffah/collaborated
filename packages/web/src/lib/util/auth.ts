import { PrismaClient } from "@prisma/client";
import { UserInputError } from "apollo-server-micro";

// params is usually either request headers or subscription connection params
export async function getClientContext(db: PrismaClient, params: any, fallbackparams?: any) {
    const def = {
        auth: "none",
    };

    let fulltoken = params.capp_auth as string | undefined;

    if (!fulltoken) {
        for (const k of Object.keys(params)) {
            if (k.toLowerCase() === "capp_auth") {
                fulltoken = params[k];
            }
        }
    }
    if (!fulltoken && fallbackparams) {
        for (const k of Object.keys(fallbackparams)) {
            if (k.toLowerCase() === "capp_auth") {
                fulltoken = fallbackparams[k];
            }
        }
    }
    if (!fulltoken) return def;

    if (fulltoken.startsWith("ACCESS ")) {
        const access = fulltoken.replace("ACCESS ", "");
        const user = await db.user.findFirst({
            where: {
                access,
            },
        });
        if (user) {
            return {
                auth: "user",
                user,
            };
        } else throw new UserInputError("Invalid access code");
    } else if (fulltoken.startsWith("TOKEN ")) {
        const token = fulltoken.replace("TOKEN ", "");
        const bot = await db.botUser.findFirst({
            where: {
                token,
            },
        });
        if (bot) {
            return {
                auth: "bot",
                bot,
            };
        } else throw new UserInputError("Invalid token");
    }
    return def;
}
