export default function buildQuery(q: Query, queryType?: string): string {
    let queryBody = "";

    function loopFields(field: Field) {
        if ("fields" in field) {
            for (const fld of Object.keys(
                <{ [k: string]: Field }>field.fields,
            )) {
                const f = (<{ [k: string]: Field }>field.fields)[fld];
                queryBody += `${fld}`;
                if (f.args) {
                    queryBody += "(";
                    const args = [];
                    for (const a of Object.keys(f.args)) {
                        const arg = f.args[a];
                        if (typeof arg === "object" && !!arg.variable) {
                            args.push(`${a}: $${arg.variable}`);
                        } else if (typeof arg === "string") {
                            args.push(`${a}: ${arg}`);
                        }
                    }
                    queryBody += args.join(", ");
                    queryBody += ")";
                }
                queryBody += " ";
                if ("fields" in f) {
                    queryBody += `{ `;
                }
                loopFields(f);
                if ("fields" in f) {
                    queryBody += "} ";
                }
            }
        }
    }

    for (const field of Object.keys(q.fields)) {
        const f = q.fields[field];
        queryBody += `${field}`;

        if (f.args) {
            queryBody += "(";
            const args = [];
            for (const a of Object.keys(f.args)) {
                const arg = f.args[a];
                if (typeof arg === "object" && !!arg.variable) {
                    args.push(`${a}: $${arg.variable}`);
                } else if (typeof arg === "string") {
                    args.push(`${a}: ${arg}`);
                }
            }
            queryBody += args.join(", ");
            queryBody += ")";
        }

        queryBody += " ";
        if (f.fields) {
            queryBody += "{ ";
            loopFields(f);
            queryBody += "} ";
        }
    }

    let query = "";

    if (q.variables) {
        query += `${queryType || "query"} ${q.name || "Query"}(`;
        const vars = [];
        for (const vr of Object.keys(q.variables)) {
            if (typeof q.variables[vr] === "string") {
                vars.push(`$${vr}: String`);
            } else if (typeof q.variables[vr] === "number") {
                vars.push(`$${vr}: Int`);
            }
        }
        query += vars.join(", ") + ")";
    }

    query += ` { ${queryBody} }`;

    return query;
}

interface Query {
    variables?: { [k: string]: string | number };
    name?: string;
    fields: { [k: string]: Field };
}

interface Field {
    args?: { [k: string]: string | { variable: string } };
    fields?: { [k: string]: Field };
}
