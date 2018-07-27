import {
    FETCH_EVENTS,
    FETCH_APP_STATUS
} from './types';

import listenService from '../services/dbListenService.js';

import {
    fetchActiveEventId, 
    getActiveGameId, 
    getActiveQuestionId, 
    getGamesForEvent, 
    getQuestionsForGame,
    updateActiveEventId,
    updateActiveGameId,
    updateActiveQuestionId
} from './manageGameplayActions';
import {fetchPlayers} from './playerTabActions';
import {fetchQuestionDuration, onQDurationChange} from './systemActions';


export const fetchEvents = () => async dispatch => {
    listenService.listenToEventsChange(resp => {
        dispatch({
            type: FETCH_EVENTS,
            resp: resp
        })
    })
}

export const fetchAppStatus = () => async dispatch => {
    listenService.listenToAppDisableChange(val => {
        dispatch({
            type: FETCH_APP_STATUS,
            resp: val
        });
    });
}

export {
    fetchActiveEventId,
    getActiveGameId,
    getActiveQuestionId,
    getGamesForEvent,
    getQuestionsForGame,
    updateActiveEventId,
    updateActiveGameId,
    updateActiveQuestionId,
    fetchPlayers,
    fetchQuestionDuration,
    onQDurationChange
}