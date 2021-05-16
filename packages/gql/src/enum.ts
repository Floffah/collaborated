import { GraphQLEnumType, GraphQLEnumValueConfigMap } from "graphql";
import { infostring, InfoString } from "./util";

export function buildSimpleEnum(info: InfoString, e: any) {
    const { name, description } = infostring(info);

    const values: GraphQLEnumValueConfigMap = {};

    for (const k of Object.keys(e)) {
        if (typeof e[k] === "number") {
            values[k] = {
                value: k,
            };
        }
    }

    return {
        type: new GraphQLEnumType({
            name,
            description,
            values,
        }),
        get: (n: number) => {
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
