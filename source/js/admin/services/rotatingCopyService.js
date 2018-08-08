import dbService from '../../services/dbService.js';

function add(val, eventId) {
    const ref = dbService.getDb().ref(`events/${eventId}/pregameRotatingCopy`);
    const newKey = ref.push().key;
    return ref.update({
        [newKey]: val
    });
}

export default {
    add
}