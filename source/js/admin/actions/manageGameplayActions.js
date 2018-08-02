import {
    ACTIVE_EVENT_CHANGED, 
    ACTIVE_GAME_CHANGED,
    ACTIVE_QUESTION_CHANGED,
    GAMES_FOR_EVENT_RECEIVED,
    QS_FOR_GAME_RECEIVED
} from './types';

import listenService from '../services/dbListenService';
import manageGameplayService from '../services/manageGameplayService';


// set values in db
export const setActiveEventId = eventId => dispatch => {
    manageGameplayService.setActiveEvent(eventId); // could use thunk to know loading
}

export const setActiveGameId = (eventId, gameId) => dispatch => {
    manageGameplayService.setActiveGame(eventId, gameId)
}

export const setActiveQuestionId = (gameId, qId) => dispatch => {
    manageGameplayService.setActiveQuestion(gameId, qId);
}

export const activateHostIsTalking = gameId => dispatch => {
    manageGameplayService.setHostIsTalking(gameId);
}

export const endGame = gameId => dispatch => {
    manageGameplayService.endGame(gameId);
}

// listen to db nodes
export const listenToActiveEventId = () => (dispatch, getState) => {
    listenService.listenToActiveEventChange(val => {
        const newEventId = val || '';   
        const previousEventId = getState().data.activeEventId;

        if (previousEventId) {
            listenService.removeListener(`events/${previousEventId}/activeGameId`);
        }

        if (newEventId) {
            dispatch(listenToActiveGameId(newEventId));
            dispatch(getGamesForEvent(newEventId));
        }
        dispatch({
            type: ACTIVE_EVENT_CHANGED,
            resp: newEventId
        });
    });
}

export const listenToActiveGameId = eventId => (dispatch, getState) => {
    listenService.listenToActiveGameChange(eventId, val => {
        const newGameId = val || '';
        const previousGameId = getState().data.activeGameId;

        if (previousGameId) {
            listenService.removeListener(`games/${previousGameId}/activeQuestionId`);
        }

        if (newGameId) {
            dispatch(listenToActiveQuestionId(newGameId));
            dispatch(getQuestionsForGame(newGameId));
        }

        dispatch({
            type: ACTIVE_GAME_CHANGED,
            resp: newGameId
        })
    });
}

export const listenToActiveQuestionId = gameId => dispatch => {
    listenService.listenToActiveQuestionChange(gameId, qId => {
        dispatch({
            type: ACTIVE_QUESTION_CHANGED,
            resp: qId
        })
    })
}

// get options from db
export const getGamesForEvent = eventId => dispatch => {
    manageGameplayService.getGamesForEvent(eventId).then(val => {
        dispatch({
            type: GAMES_FOR_EVENT_RECEIVED,
            resp: val
        })
    });
}

export const getQuestionsForGame = gameId => dispatch => {
    manageGameplayService.getQuestionsForGame(gameId).then(val => {
        dispatch({
            type: QS_FOR_GAME_RECEIVED,
            resp: val
        })
    });
}