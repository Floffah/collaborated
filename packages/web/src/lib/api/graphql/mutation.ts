import { buildObject } from "@collaborated/gql";
import { AuthFields } from "./mutation/auth";
import { UserCreateFields } from "./mutation/users/usercreate";
import { QueryContext } from "../../util/types";

export const mutation = buildObject<any, QueryContext>("RootMutation; Root mutation", () => [...AuthFields, ...UserCreateFields]);
