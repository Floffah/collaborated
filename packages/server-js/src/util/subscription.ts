import { DefaultArgs } from "@collaborated/gql";

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
                console.log(payload.filter[key], search[key]);
                if (payload.filter[key] !== search[key]) return false;
            }
        }

        return true;
    };
}

export function withValidFilterData<Context, Args = DefaultArgs>(
    validate: (p: any, a: Args, c: Context, i: any) => Record<any, any>,
) {
    return (p: any, a: Args, c: Context, i: any) => {
        if (!p.filter) throw "No filter";
        return withFilterData(validate(p, a, c, i))(p, a, c, i);
    };
}

export function filterContext<Context>(fn: (c: Context) => AsyncIterator<any>) {
    return (_p?: any, _a?: any, c?: Context) => {
        if (!c) throw "No context";
        return fn(c);
    };
}
