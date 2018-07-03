import dbService from '../../services/dbService.js';

const dbListenService = function() {

    function listenToFB(ref, callback) {
        dbService.getDb().ref(ref).on('value', snapshot => {
            const data = snapshot.val() || {};
            const keys = Object.keys(data);
    
            const itemList = keys.reduce((accum, key) => {
                const newItem = data[key];
                newItem.id = key;
                return accum.concat([newItem]);
            }, []);
            callback(itemList);
        });
    }
    
    function listenToEventsChange(callback) {
        listenToFB('events', callback);
    }
    
    function listenToPlayersChange(callback) {
        listenToFB('players', callback);
    }

    return {
        listenToEventsChange,
        listenToPlayersChange
    }
}

const inst = dbListenService();

export default inst;