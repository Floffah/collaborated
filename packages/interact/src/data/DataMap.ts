export default class DataMap<K = string, V = any> extends Map<K, V> {
    find(cond: (k: K, v: V) => boolean): V | undefined {
        for (const entry of this.entries()) {
            if (cond(entry[0], entry[1])) return entry[1];
        }
        return undefined;
    }
}
