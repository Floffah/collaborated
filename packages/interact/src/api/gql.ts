export default function buildQuery(q:Query, queryType?: string):string {
    let queryBody = ""

    function loopFields(field: Field) {
        if("fields" in field) {
            for(let fld of Object.keys(<{[k:string]:Field}>field.fields)) {
                let f = (<{[k:string]:Field}>field.fields)[fld];
                queryBody += `${fld}`
                if(!!f.args) {
                    queryBody += "("
                    let args = []
                    for(let a of Object.keys(f.args)) {
                        let arg = f.args[a]
                        if(typeof arg === "object" && !!arg.variable) {
                            args.push(`${a}: $${arg.variable}`)
                        } else if(typeof arg === "string") {
                            args.push(`${a}: ${arg}`);
                        }
                    }
                    queryBody += args.join(", ");
                    queryBody += ")"
                }
                queryBody += " "
                if("fields" in f) {
                    queryBody += `{ `
                }
                loopFields(f)
                if("fields" in f) {
                    queryBody += "} "
                }
            }
        }
    }

    for(let field of Object.keys(q.fields)) {
        let f = q.fields[field]
        queryBody += `${field}`

        if(!!f.args) {
            queryBody += "("
            let args = []
            for(let a of Object.keys(f.args)) {
                let arg = f.args[a]
                if(typeof arg === "object" && !!arg.variable) {
                    args.push(`${a}: $${arg.variable}`)
                } else if(typeof arg === "string") {
                    args.push(`${a}: ${arg}`);
                }
            }
            queryBody += args.join(", ");
            queryBody += ")"
        }

        queryBody += " "
        if(!!f.fields) {
            queryBody += "{ "
            loopFields(f)
            queryBody += "} "
        }
    }

    let query = ""

    if(!!q.variables) {
        query += `${queryType || "query"} ${q.name || "Query"}(`
        let vars = []
        for(let vr of Object.keys(q.variables)) {
            if(typeof q.variables[vr] === "string") {
                vars.push(`$${vr}: String`)
            } else if(typeof q.variables[vr] === "number") {
                vars.push(`$${vr}: Int`)
            }
        }
        query += vars.join(", ") + ")"
    }

    query += ` { ${queryBody} }`

    return query;
}

interface Query {
    variables?: {[k:string]:string|number},
    name?: string,
    fields: {[k:string]:Field}
}

interface Field {
    args?: {[k:string]:(string|{variable: string})},
    fields?: {[k:string]:Field}
}
