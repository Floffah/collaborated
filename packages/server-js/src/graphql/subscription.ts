import { buildObject, buildSubscriptionField } from "@collaborated/gql";
import { QueryContext, SubscriptionType } from "../util/types.js";
import { buildSimpleEnum } from "@collaborated/gql";
import { userValidation } from "../util/validation";

export enum StateChange {
    EXPIRE,
}

export const StateChangeEnum = buildSimpleEnum("StateChangeGQL; Enum for different types of session state change", StateChange);

export const subscription = buildObject<any, QueryContext>("RootSubscribtion; Root subscribtion", () => [
    buildSubscriptionField(
        "sessionStateChange; Updated when the current session changes state. Most commonly used to check for the ready state",
        StateChangeEnum.type,
        (_s, _a, c) => {
            userValidation(c, true);
            if (!c.user) throw "No user";
            return c.ps.asyncIterator(`${SubscriptionType.sessionStateChange}.${c.user.id}`);
        },
    ),
]);
