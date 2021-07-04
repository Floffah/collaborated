import { withTypedFilter } from "@collaborated/gql";
import { SubscriptionType } from "../../../util/types";
import { filterContext, withValidFilterData } from "../../../util/subscription";
import { enumType } from "nexus";
import { SubscriptionBuilder } from "nexus/dist/definitions/subscriptionType";

export enum StateChange {
    EXPIRE,
}

// export const StateChangeEnum = buildSimpleEnum("StateChangeGQL; Enum for different types of session state change", StateChange);

export const StateChangeEnum = enumType({
    name: "StateChangeEnum",
    members: ["EXPIRE"],
});

// export const SessionFields: LiteralTypeFields<any, QueryContext> = [
//     buildField(
//         "sessionStateChange; Updated when the current session changes state. Most commonly used to check for the ready state",
//         StateChangeEnum.type,
//         undefined,
//         undefined,
//         withTypedFilter(
//             filterContext((c) => c.ps.asyncIterator(SubscriptionType.sessionStateChange), true, true),
//             withValidFilterData(
//                 (_p, _a, c, _i) => {
//                     let id;
//                     if (c.auth === "user") {
//                         id = c.user.id;
//                     } else if (c.auth === "bot") {
//                         id = c.bot.id;
//                     }
//                     return {
//                         id,
//                     };
//                 },
//                 true,
//                 false,
//             ),
//         ),
//     ),
// ];

export const SessionFields = (t: SubscriptionBuilder) => {
    t.field("sessionStateChange", {
        type: StateChangeEnum,
        description: "Updated when the current session changes state. Most commonly used to check for the ready state",
        resolve: (data) => data,
        subscribe: withTypedFilter(
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
    });
};

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
