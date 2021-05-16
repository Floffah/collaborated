import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLObjectType, GraphQLSchema } from "graphql";
import { DefaultArgs, InfoString, infostring } from "./util";

export function buildSchema(query: GraphQLObjectType, mutation?: GraphQLObjectType, subscription?: GraphQLObjectType) {
    return new GraphQLSchema({ query, mutation, subscription });
}

export type BuildQueryFields<Source = any, Context = any, Args = DefaultArgs> = [
    string,
    GraphQLFieldConfig<Source, Context, Args>,
];

export function buildObject<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    fields: BuildQueryFields<Source, Context, Args>[] | (() => BuildQueryFields<Source, Context, Args>[]),
) {
    const { name, description } = infostring(info);

    const fieldmap: GraphQLFieldConfigMap<Source, Context> = {};

    let f = fields as BuildQueryFields<Source, Context, Args>[];
    if (typeof fields === "function") f = fields();

    for (const field of f) {
        fieldmap[field[0]] = field[1] as GraphQLFieldConfig<Source, Context>;
    }

    return new GraphQLObjectType({
        name,
        description,
        fields: fieldmap,
    });
}
