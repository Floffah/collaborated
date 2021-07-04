import { queryType } from "nexus";

export const query = queryType({
    definition: (t) => {
        t.string("ping", {
            description: "For round-trip calculation purposes",
            resolve: () => "pong",
        });
    },
});
