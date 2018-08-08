import dbService from '../../services/dbService.js';

function updateDB(id, value, eventId) {
    const ref = dbService.getDb().ref(`events/${eventId}/pregameRotatingCopy`);
    const key = id || ref.push().key;
    ref.update({
        [key]: value
    })
}

function addRotatingCopy(val, eventId) {
    updateDB(null, val, eventId);
}

function editRotatingCopy(id, text, eventId) {
    updateDB(id, text, eventId);
}

function deleteRotatingCopy(id, eventId) {
    updateDB(id, null, eventId);
}

export default {
    addRotatingCopy,
    editRotatingCopy,
    deleteRotatingCopy
}