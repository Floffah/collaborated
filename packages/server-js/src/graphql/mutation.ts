import { buildObject } from "@collaborated/gql";
import { QueryContext } from "../util/types.js";
import { AuthFields } from "./mutation/auth";

export const mutation = buildObject<any, QueryContext>("RootMutation; Root mutation", () => [...AuthFields]);
