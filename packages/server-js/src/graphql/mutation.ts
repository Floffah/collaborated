import { buildObject } from "@collaborated/gql";
import { QueryContext } from "../util/types.js";
import { AuthFields } from "./mutation/auth";
import { UserCreateFields } from "./mutation/users/usercreate";

export const mutation = buildObject<any, QueryContext>("RootMutation; Root mutation", () => [...AuthFields, ...UserCreateFields]);
