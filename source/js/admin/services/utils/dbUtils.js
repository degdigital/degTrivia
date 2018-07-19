export function objToArray(data = {}) {
    const keys = Object.keys(data);

    return keys.reduce((accum, key) => {
        const newItem = data[key];
        newItem.id = key;
        return accum.concat([newItem]);
    }, []);
}