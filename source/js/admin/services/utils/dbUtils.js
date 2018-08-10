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

export function arrayToObj(data = []) {
    const retVal = {};

    data.map(item => {
        retVal[item.id] = {...item};
        delete retVal[item.id].id;
    })

    return retVal;
}

export function getValue(ref){
    return dbService.getDb().ref(ref).once('value')
        .then(snap => snap.val());
}

export function replaceNewIds(ref, data) {
    const retVal = {...data};

    if (retVal.isNew) {
        retVal.id = ref.push().key;
        delete retVal.isNew;
    }

    return retVal;
}