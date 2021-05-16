import { DefaultArgs, infostring, InfoString } from "./util";
import { BuildQueryFields } from "./query";
import {
    GraphQLArgumentConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLInputType,
    GraphQLOutputType,
} from "graphql";

// type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;
// type ResolveArgs = Record<
//     Parameters<typeof buildField>[3] extends BuildArgument[] ? ElementType<Parameters<typeof buildField>[3]> : string,
//     any
// >;
// ^ no good way to do this yet without typescript complaining,

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

export function buildSubscriptionField<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    type: GraphQLOutputType,
    subscribe: GraphQLFieldResolver<Source, Context, Args>,
    args?: BuildArgument[],
    resolve?: GraphQLFieldResolver<Source, Context, Args>,
) {
    const standard = buildField(info, type, resolve, args);

    standard[1] = { ...standard[1], subscribe };

    return standard;
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
