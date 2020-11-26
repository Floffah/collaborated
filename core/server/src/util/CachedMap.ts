export default class CachedMap<V = string> {
    data: [string, V | null, Date, (() => V)?][] = [];
    keys: { [k: string]: number } = {};

    put(k: string, v: () => V, i?: V) {
        if (this.keys.hasOwnProperty(k)) {
            let index = this.keys[k];
            this.data[index] = [k, i || v(), new Date(), v];
        } else {
            this.data.push([k, i || v(), new Date(), v]);
            this.keys[k] = this.data.length - 1;
        }
    }

    get(k: string): V | null {
        let index = this.keys[k];
        return this.data[index][1];
    }

    has(k: string): boolean {
        return this.keys.hasOwnProperty(k);
    }
}
