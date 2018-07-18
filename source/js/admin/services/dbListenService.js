import dbService from '../../services/dbService.js';


function objToArray(data = {}) {
    const keys = Object.keys(data);

    return keys.reduce((accum, key) => {
        const newItem = data[key];
        newItem.id = key;
        return accum.concat([newItem]);
    }, []);
}

function listenToFB(ref, callback, convertToArray = false) {
    dbService.getDb().ref(ref).on('value', snapshot => {
        let retVal = snapshot.val();
        if (convertToArray) {
            retVal = objToArray(retVal);
        }
        
        callback(retVal);
    });
}

function listenToEventsChange(callback) {
    listenToFB('events', callback, true);
}

function listenToPlayersChange(callback) {
    listenToFB('players', callback, true);
}

function listenToAppDisableChange(callback) {
    listenToFB('disableAll', callback)
}

function listenToQDurationChange(callback) {
    listenToFB('questionDuration', callback);
}

function listenToActiveEventChange(callback) {
    listenToFB('activeEventId', callback);
}

export default {
    listenToEventsChange,
    listenToPlayersChange,
    listenToAppDisableChange,
    listenToQDurationChange,
    listenToActiveEventChange
};