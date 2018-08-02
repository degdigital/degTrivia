import dbService from '../../services/dbService.js';
import {objToArray, getValue} from './utils/dbUtils';

function setActiveEvent(eventId) {
    return dbService.getDb().ref().update({
        activeEventId: eventId || false
    });
}

function setActiveGame(activeEventId, gameId) {
    return dbService.getDb().ref(`events/${activeEventId}`).update({
        activeGameId: gameId || false
    });
}

function setActiveQuestion(activeGameId, qId) {
    return dbService.getDb().ref(`games/${activeGameId}`).update({
        activeQuestionId: qId || false
    });
}

function getGamesForEvent(eventId) {
    return dbService.getDb().ref('games').orderByChild('event').equalTo(eventId).once('value')
        .then(snap => objToArray(snap.val()));
}

function getQuestionsForGame(gameId) {
    return getValue(`games/${gameId}/questions`)
        .then(questions => {
            if (!questions) {
                return [];
            }
            const keys = Object.keys(questions);

            return keys.reduce((accum, key) => {
                const newItem = questions[key];
                newItem.id = key;
                newItem.name = newItem.question;
                return accum.concat([newItem]);
            }, []);
        });
}

export default {
    setActiveEvent,
    setActiveGame,
    setActiveQuestion,
    getGamesForEvent,
    getQuestionsForGame
}