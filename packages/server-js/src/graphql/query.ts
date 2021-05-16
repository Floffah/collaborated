import { buildField, buildObject } from "@collaborated/gql";
import { GraphQLString } from "graphql";
import { QueryContext, SubscriptionType } from "../util/types.js";
import { StateChangeEnum } from "./subscription";

export const query = buildObject<any, QueryContext>("RootQuery; Root query", () => [
    buildField("ping; For round-trip calculation purposes", GraphQLString, (_s, _a, c) => {
        c.ps.publish(SubscriptionType.sessionStateChange + ".1", {
            sessionStateChange: StateChangeEnum.EXPIRE,
        });
        return "pong";
    }),
]);
