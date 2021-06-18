import { buildField, buildSimpleEnum, LiteralTypeFields, withTypedFilter } from "@collaborated/gql";
import { QueryContext, SubscriptionType } from "../../../util/types";
import { filterContext, withValidFilterData } from "../../../util/subscription";

export enum StateChange {
    EXPIRE,
}

export const StateChangeEnum = buildSimpleEnum("StateChangeGQL; Enum for different types of session state change", StateChange);

export const SessionFields: LiteralTypeFields<any, QueryContext> = [
    buildField(
        "sessionStateChange; Updated when the current session changes state. Most commonly used to check for the ready state",
        StateChangeEnum.type,
        undefined,
        undefined,
        withTypedFilter(
            filterContext((c) => c.ps.asyncIterator(SubscriptionType.sessionStateChange), true, true),
            withValidFilterData(
                (_p, _a, c, _i) => {
                    let id;
                    if (c.auth === "user") {
                        id = c.user.id;
                    } else if (c.auth === "bot") {
                        id = c.bot.id;
                    }
                    return {
                        id,
                    };
                },
                true,
                false,
            ),
        ),
    ),
];

// example of publishing the event for sessionStateChange (c = QueryContext)

/*
        c.ps.publish(
            SubscriptionType.sessionStateChange,
            publishData(
                {
                    sessionStateChange: StateChangeEnum.EXPIRE,
                },
                {
                    id: 1,
                },
            ),
        );
 */
