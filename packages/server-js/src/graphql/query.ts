import { buildField, buildObject } from "@collaborated/gql";
import { GraphQLString } from "graphql";
import { QueryContext } from "../util/types.js";

export const query = buildObject<any, QueryContext>("RootQuery; Root query", () => [
    buildField("ping; For round-trip calculation purposes", GraphQLString, () => "pong"),
]);
