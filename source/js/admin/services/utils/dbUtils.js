export function objToArray(data = {}) {
    if (!data) {
        return [];
    }
    
    const keys = Object.keys(data);

    return keys.reduce((accum, key) => {
        const newItem = data[key];
        newItem.id = key;
        return accum.concat([newItem]);
    }, []);
}