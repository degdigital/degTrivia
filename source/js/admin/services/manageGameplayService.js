import dbService from '../../services/dbService.js';
import {objToArray} from './utils/dbUtils';

function setActiveEvent(eventId) {
    dbService.getDb().ref().update({
        activeEventId: eventId || false
    });
}

function setActiveGame(activeEventId, gameId) {
    dbService.getDb().ref(`events/${activeEventId}`).update({
        activeGameId: gameId || false
    });
}

function getActiveGame(eventId) {
    return dbService.getDb().ref(`events/${eventId}/activeGameId`).once('value')
        .then(snap => snap.val());
}

function getGamesForEvent(eventId) {
    return dbService.getDb().ref('games').orderByChild('event').equalTo(eventId).once('value')
        .then(snap => objToArray(snap.val()));
}

export default {
    setActiveEvent,
    setActiveGame,
    getActiveGame,
    getGamesForEvent
}