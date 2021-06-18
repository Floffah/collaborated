import { buildObject } from "@collaborated/gql";
import { SessionFields } from "./subscription/session";
import { QueryContext } from "../../util/types";

export const subscription = buildObject<any, QueryContext>("RootSubscribtion; Root subscribtion", [...SessionFields]);
