import {
    FETCH_ACTIVE_EVENT, 
    FETCH_ACTIVE_GAME_ID,
    FETCH_ACTIVE_QUESTION,
    FETCH_GAMES_FOR_EVENT,
    FETCH_QS_FOR_GAME
} from './types';

import listenService from '../services/dbListenService';
import manageGameplayService from '../services/manageGameplayService';

export const fetchActiveEventId = () => dispatch => {
    listenService.listenToActiveEventChange(val => {
        const eventId = val || '';
        dispatch(updateActiveEventId(eventId));
    });
}

export const updateActiveEventId = eventId => dispatch => {
    dispatch({
        type: FETCH_ACTIVE_EVENT,
        resp: eventId
    });

    if (eventId) {
        dispatch(getActiveGameId(eventId));
        dispatch(getGamesForEvent(eventId));
    }
}

export const getActiveGameId = eventId => dispatch => {
    manageGameplayService.getActiveGame(eventId).then(val => {
        const gameId = val || '';
        dispatch(updateActiveGameId(gameId));
    });
}

export const updateActiveGameId = gameId => dispatch => {
    dispatch({
        type: FETCH_ACTIVE_GAME_ID,
        resp: gameId
    })
    if (gameId) {
        dispatch(getActiveQuestionId(gameId));
        dispatch(getQuestionsForGame(gameId));
    }
}

export const getActiveQuestionId = gameId => dispatch => {
    manageGameplayService.getActiveQuestion(gameId).then(val => {
        dispatch(updateActiveQuestionId(val))
    })
}

export const updateActiveQuestionId = qId => dispatch => {
    dispatch({
        type: FETCH_ACTIVE_QUESTION,
        resp: qId
    })
}

export const getGamesForEvent = eventId => dispatch => {
    manageGameplayService.getGamesForEvent(eventId).then(val => {
        dispatch({
            type: FETCH_GAMES_FOR_EVENT,
            resp: val
        })
    });
}

export const getQuestionsForGame = gameId => dispatch => {
    manageGameplayService.getQuestionsForGame(gameId).then(val => {
        dispatch({
            type: FETCH_QS_FOR_GAME,
            resp: val
        })
    });
}