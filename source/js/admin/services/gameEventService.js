import dbService from '../../services/dbService.js';

function setActiveEvent(eventId) {
    dbService.getDb().ref().update({
        activeEventId: eventId || false
    });
}

export default {
    setActiveEvent
}