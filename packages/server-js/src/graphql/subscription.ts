import { buildObject, buildSubscriptionField } from "@collaborated/gql";
import { QueryContext, SubscriptionType } from "../util/types.js";
import { buildSimpleEnum } from "@collaborated/gql";

export enum StateChange {
    EXPIRE,
}

export const StateChangeGQL = buildSimpleEnum("StateChangeGQL; Enum for different types of session state change", StateChange);

export const subscription = buildObject<any, QueryContext>("RootSubscribtion; Root subscribtion", () => [
    buildSubscriptionField(
        "sessionStateChange; Updated when the current session changes state. Most commonly used to check for the ready state",
        StateChangeGQL.type,
        (_s, _a, c) => c.ps.asyncIterator(SubscriptionType.sessionStateChange),
    ),
]);
