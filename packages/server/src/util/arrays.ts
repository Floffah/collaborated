export function forWait<V>(
    arr: V[],
    iterator: (val: V, next: () => void) => void,
    ind = 0,
) {
    if (arr[ind]) {
        iterator(arr[ind], () => {
            if (arr[ind + 1]) {
                forWait(arr, iterator, ind + 1);
            }
        });
    }
}
