import { DefaultArgs, infostring, InfoString } from "./util";
import { BuildQueryFields } from "./query";
import {
    GraphQLArgumentConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLInputType,
    GraphQLOutputType,
} from "graphql";

export type TypeFields<Source, Context, Args = DefaultArgs> =
    | LiteralTypeFields<Source, Context, Args>
    | FunctionTypeFields<Source, Context, Args>;

export type LiteralTypeFields<Source, Context, Args = DefaultArgs> = BuildQueryFields<Source, Context, Args>[];
export type FunctionTypeFields<Source, Context, Args = DefaultArgs> = () => BuildQueryFields<Source, Context, Args>[];

export function buildField<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    type: GraphQLOutputType,
    resolve?: GraphQLFieldResolver<Source, Context, Args>,
    args?: BuildArgument[],
    subscribe?: GraphQLFieldResolver<Source, Context, Args>,
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
            subscribe,
        },
    ];
}

// export function buildSubscriptionField<Source = any, Context = any, Args = DefaultArgs>(
//     info: InfoString,
//     type: GraphQLOutputType,
//     subscribe: GraphQLFieldResolver<Source, Context, Args>,
//     args?: BuildArgument[],
//     resolve?: GraphQLFieldResolver<Source, Context, Args>,
// ) {
//     const standard = buildField(info, type, resolve, args);
//
//     standard[1] = { ...standard[1], subscribe };
//
//     return standard;
// }

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
