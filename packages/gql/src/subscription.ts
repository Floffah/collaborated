import { DefaultArgs } from "./util";
import { withFilter } from "graphql-subscriptions";

export type FilterFn<Context, Args = DefaultArgs> = (
    rootValue?: any,
    args?: Args,
    context?: Context,
    info?: any,
) => boolean | Promise<boolean>;
export type ResolverFn<Context, Args = DefaultArgs> = (
    rootValue?: any,
    args?: Args,
    context?: Context,
    info?: any,
) => AsyncIterator<any>;

export function withTypedFilter<Context, Args = DefaultArgs>(
    iterator: ResolverFn<Context, Args>,
    filter: FilterFn<Context, Args>,
): ResolverFn<Context, Args> {
    return withFilter(iterator, filter);
}
