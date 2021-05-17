import { buildObject } from "@collaborated/gql";
import { QueryContext } from "../util/types.js";
import { SessionFields } from "./subscription/session";

export const subscription = buildObject<any, QueryContext>("RootSubscribtion; Root subscribtion", [...SessionFields]);
