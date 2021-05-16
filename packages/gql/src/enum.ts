import { GraphQLEnumType, GraphQLEnumValueConfigMap } from "graphql";
import { infostring, InfoString } from "./util";

export function buildSimpleEnum<E extends Record<string | number | symbol, string | number | symbol>>(
    info: InfoString,
    e: E,
): {
    type: GraphQLEnumType;
    get: (n: keyof E) => string;
} & Record<keyof E, any> {
    const { name, description } = infostring(info);

    const values: GraphQLEnumValueConfigMap = {};
    const enumr: Record<keyof E, any> = {} as Record<keyof E, any>;

    for (const k of Object.keys(e)) {
        if (typeof e[k] === "number") {
            enumr[k as keyof E] = k;
            values[k] = {
                value: k,
            };
        }
    }

    return {
        ...enumr,
        type: new GraphQLEnumType({
            name,
            description,
            values,
        }),
        get: (n: keyof E) => {
            return e[n] as string;
        },
    };
}

export function buildAdvancedEnum(info: InfoString, e: [InfoString, any | undefined][]) {
    const { name, description } = infostring(info);

    const values: GraphQLEnumValueConfigMap = {};

    for (const inf of e) {
        const { name, description } = infostring(inf[0]);
        values[name] = {
            description,
            value: inf[1] ?? name,
        };
    }

    return {
        type: new GraphQLEnumType({
            name,
            description,
            values,
        }),
        get: (n: any) => {
            return infostring(e[n][0]).name;
        },
        values,
    };
}
