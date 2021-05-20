export default function gql(parts: TemplateStringsArray, ...ins: any[]) {
    let final = "";

    for (let i = 0; i < parts.length; i++) {
        if (ins[i]) {
            final += parts[i] + ins[i];
        } else {
            final += parts[i];
        }
    }

    return final;
}
