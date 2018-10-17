import {
    EVENTS_RECEIVED,
    APP_STATUS_RECEIVED,
    GAMES_RECEIVED,
    EVENT_MAP_UPDATED
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
        dispatch(makeEventMapping(resp));

        dispatch({
            type: EVENTS_RECEIVED,
            resp: resp
        })
    })
}

const makeEventMapping = eventData => dispatch => {
    const newMap = eventData.reduce((accum, evt) => {
        accum[evt.id] = evt.name;
        return accum;
    }, {})
    dispatch({
        type: EVENT_MAP_UPDATED,
        resp: newMap
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