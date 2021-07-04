import { SessionFields } from "./subscription/session";
import { subscriptionType } from "nexus";

// export const subscription = buildObject<any, QueryContext>("RootSubscribtion; Root subscribtion", [...SessionFields]);

export const subscription = subscriptionType({
    definition: (t) => {
        SessionFields(t);
    },
});
