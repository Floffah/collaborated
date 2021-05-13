import { DefaultArgs, infostring, InfoString } from "./util";
import { BuildQueryFields } from "./query";
import {
    GraphQLArgumentConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLInputType,
    GraphQLOutputType,
} from "graphql";

export function buildField<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    type: GraphQLOutputType,
    resolve?: GraphQLFieldResolver<Source, Context, Args>,
    args?: BuildArgument[],
): BuildQueryFields<Source, Context, Args> {
    const { name, description } = infostring(info);

    let a: GraphQLFieldConfigArgumentMap | undefined = undefined;

    if (args) {
        a = {};
        for (const arg of args) {
            a[arg[0]] = arg[1];
        }
    }

    return [
        name,
        {
            description,
            type,
            resolve,
            args: a,
        },
    ];
}

export type BuildArgument = [string, GraphQLArgumentConfig];

export function buildArgument(info: InfoString, type: GraphQLInputType, defaultValue?: any, deprecated?: string): BuildArgument {
    const { name, description } = infostring(info);

    return [
        name,
        {
            description,
            type,
            defaultValue,
            deprecationReason: deprecated,
        },
    ];
}
