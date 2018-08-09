import dbService from '../../services/dbService.js';
import {objToArray} from './utils/dbUtils';

function listenToFB(ref, callback, convertToArray = false) {
    dbService.getDb().ref(ref).on('value', snapshot => {
        let retVal = snapshot.val();
        if (convertToArray) {
            retVal = objToArray(retVal);
        }
        
        callback(retVal);
    });
}

function removeListener(ref) {
    dbService.getDb().ref(ref).off('value');
}

function listenToEventsChange(callback) {
    listenToFB('events', callback, true);
}

function listenToGamesChange(callback) {
    listenToFB('games', callback, true)
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

function listenToActiveGameChange(eventId, callback) {
    listenToFB(`events/${eventId}/activeGameId`, callback);
}

function listenToActiveQuestionChange(gameId, callback) {
    listenToFB(`games/${gameId}/activeQuestionId`, callback);
}

export default {
    removeListener,
    listenToEventsChange,
    listenToPlayersChange,
    listenToAppDisableChange,
    listenToQDurationChange,
    listenToActiveEventChange,
    listenToActiveGameChange,
    listenToActiveQuestionChange,
    listenToGamesChange
};