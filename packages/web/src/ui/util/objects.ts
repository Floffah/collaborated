export function merge(t: any, m: any) {
    for (const k of Object.keys(m)) {
        if (t[k]) {
            if (typeof t[k] === "object") {
                merge(t[k], m[k]);
            } else {
                t[k] = m[k];
            }
        }
    }
}
