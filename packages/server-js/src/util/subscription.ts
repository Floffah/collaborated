import { DefaultArgs } from "@collaborated/gql";
import { clientValidation } from "./validation";
import { QueryContext } from "./types";

export function publishData(pubdata: any, filterdata?: Record<any, any>) {
    return {
        ...pubdata,
        filter: filterdata
            ? {
                  ...filterdata,
              }
            : undefined,
    };
}

export function withFilterData<Context, Args = DefaultArgs>(search: Record<any, any>) {
    return (payload: any, _args: Args, _context: Context, _info: any) => {
        if (Object.prototype.hasOwnProperty.call(payload, "filter")) {
            const keys = Object.keys(search);

            for (const key of keys) {
                if (payload.filter[key] !== search[key]) return false;
            }
        }

        return true;
    };
}

export function withValidFilterData<Args = DefaultArgs>(
    validate: (p: any, a: Args, c: QueryContext, i: any) => Record<any, any>,
    doValidation = false,
    doInvalidate = true,
) {
    return (p: any, a: Args, c: QueryContext, i: any) => {
        if (!p.filter) throw "No filter";
        if (doValidation) clientValidation(c, !doInvalidate);
        return withFilterData(validate(p, a, c, i))(p, a, c, i);
    };
}

export function filterContext(fn: (c: QueryContext) => AsyncIterator<any>, doValidation = false, doInvalidate = true) {
    return (_p?: any, _a?: any, c?: QueryContext) => {
        if (!c) throw "No context";
        if (doValidation) clientValidation(c, !doInvalidate);
        return fn(c);
    };
}
