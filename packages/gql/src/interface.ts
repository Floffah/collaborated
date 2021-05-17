import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLInterfaceType } from "graphql";
import { DefaultArgs, infostring, InfoString } from "./util";
import { BuildQueryFields } from "./query";
import { TypeFields } from "./fields";

export function buildInterface<Source = any, Context = any, Args = DefaultArgs>(
    info: InfoString,
    fields: TypeFields<Source, Context, Args>,
) {
    const { name, description } = infostring(info);

    const fieldmap: GraphQLFieldConfigMap<Source, Context> = {};

    let f = fields as BuildQueryFields<Source, Context, Args>[];
    if (typeof fields === "function") f = fields();

    for (const field of f) {
        fieldmap[field[0]] = field[1] as GraphQLFieldConfig<Source, Context>;
    }

    return new GraphQLInterfaceType({
        name,
        description,
        fields: fieldmap,
    });
}
