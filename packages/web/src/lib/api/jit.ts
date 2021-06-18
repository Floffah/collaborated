import { GraphQLRequestContextExecutionDidStart } from "apollo-server-types";
import { GraphQLSchema } from "graphql";
import { CompiledQuery, compileQuery, CompilerOptions, isCompiledQuery } from "graphql-jit";
import LRU from "tiny-lru";

export const executor = (schema: GraphQLSchema, cacheSize = 1024, compilerOpts: Partial<CompilerOptions> = {}) => {
    const cache = LRU<CompiledQuery>(cacheSize);

    return async (o: GraphQLRequestContextExecutionDidStart<Record<string, any>>) => {
        const prefix = o.operationName ?? "NotParametrized";
        const cacheKey = `${prefix}-${o.queryHash}`;
        let compiled = cache.get(cacheKey);
        if (!compiled) {
            const compilation = compileQuery(schema, o.document, o.operationName ?? undefined, compilerOpts);
            if (isCompiledQuery(compilation)) {
                compiled = compilation;
                cache.set(cacheKey, compiled);
            } else {
                return compilation;
            }
        }
        return compiled.query(undefined, o.context, o.request.variables ?? {});
    };
};
