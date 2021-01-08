export default class CachedMap<V = string> {
    data: [string, V | null, Date, (() => V)?][] = [];
    keys: { [k: string]: number } = {};

    put(k: string, v: () => V, i?: V) {
        if (k in this.keys) {
            const index = this.keys[k];
            this.data[index] = [k, i || v(), new Date(), v];
        } else {
            this.data.push([k, i || v(), new Date(), v]);
            this.keys[k] = this.data.length - 1;
        }
    }

    get(k: string): V | null {
        const index = this.keys[k];
        return this.data[index][1];
    }

    has(k: string): boolean {
        return k in this.keys;
    }
}
