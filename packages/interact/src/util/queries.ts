import { ASTNode, print } from "graphql";

export function printQuery(ast: ASTNode, minify?: boolean) {
    const p = print(ast);
    return minify ? p.replace(/\s/g, " ") : p.replace(/\s$/, "");
}
