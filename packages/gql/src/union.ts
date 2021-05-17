import { infostring, InfoString } from "./util";
import { GraphQLUnionType, GraphQLUnionTypeConfig } from "graphql";

export function buildUnion<Source = any, Context = any>(
    info: InfoString,
    types: GraphQLUnionTypeConfig<Source, Context>["types"],
) {
    const { name, description } = infostring(info);

    return new GraphQLUnionType({
        name,
        description,
        types,
    } as GraphQLUnionTypeConfig<Source, Context>);
}
