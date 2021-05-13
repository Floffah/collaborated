import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLObjectType, GraphQLSchema } from "graphql";
import { DefaultArgs, InfoString, infostring } from "./util";

export function buildSchema(query: GraphQLObjectType) {
    return new GraphQLSchema({ query });
}

export type BuildQueryFields<Source = any, Context = any, Args = DefaultArgs> = [
    string,
    GraphQLFieldConfig<Source, Context, Args>,
];

export function buildObject<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    fields: BuildQueryFields[] | (() => BuildQueryFields[]),
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
