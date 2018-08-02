import dbService from '../../../services/dbService';

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

export function getValue(ref){
    return dbService.getDb().ref(ref).once('value')
        .then(snap => snap.val());
}