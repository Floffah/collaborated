import { mutationType } from "nexus";
import { AuthFields } from "./mutation/auth";
import { UserCreateFields } from "./mutation/users/usercreate";

export const mutation = mutationType({
    definition: (t) => {
        AuthFields(t);
        UserCreateFields(t);
    },
});
