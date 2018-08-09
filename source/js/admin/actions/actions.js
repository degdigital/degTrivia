import {
    EVENTS_RECEIVED,
    APP_STATUS_RECEIVED,
    GAMES_RECEIVED
} from './types';

import listenService from '../services/dbListenService.js';

import {
    setActiveEventId,
    setActiveGameId,
    setActiveQuestionId,
    activateHostIsTalking,
    endGame,
    fetchActiveEventId,
    listenToActiveGameId,
    listenToActiveQuestionId,
    getGamesForEvent,
    getQuestionsForGame
} from './manageGameplayActions';
import {fetchPlayers} from './playerTabActions';
import {fetchQuestionDuration, onQDurationChange} from './systemActions';


export const fetchEvents = () => async dispatch => {
    listenService.listenToEventsChange(resp => {
        dispatch({
            type: EVENTS_RECEIVED,
            resp: resp
        })
    })
}

export const fetchGames = () => async dispatch => {
    listenService.listenToGamesChange(resp => {
        dispatch({
            type: GAMES_RECEIVED,
            resp: resp
        })
    })
}

export const fetchAppStatus = () => async dispatch => {
    listenService.listenToAppDisableChange(val => {
        dispatch({
            type: APP_STATUS_RECEIVED,
            resp: val
        });
    });
}

export {
    setActiveEventId,
    setActiveGameId,
    setActiveQuestionId,
    activateHostIsTalking,
    endGame,
    fetchActiveEventId,
    listenToActiveGameId,
    listenToActiveQuestionId,
    getGamesForEvent,
    getQuestionsForGame,
    fetchPlayers,
    fetchQuestionDuration,
    onQDurationChange
}