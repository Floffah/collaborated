import DataMap from "../data/DataMap";

export default class BaseStore<K = string, V = any> {
    cache: DataMap<K, V> = new DataMap();
}
