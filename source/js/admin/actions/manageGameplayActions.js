import {
    FETCH_ACTIVE_EVENT, 
    FETCH_ACTIVE_GAME_ID,
    FETCH_GAMES_FOR_EVENT
} from './types';

import listenService from '../services/dbListenService';
import manageGameplayService from '../services/manageGameplayService';
import { batchActions } from 'redux-batched-actions';

export const fetchActiveEventId = () => dispatch => {
    listenService.listenToActiveEventChange(val => {
        const eventId = val || '';
        dispatch({
            type: FETCH_ACTIVE_EVENT,
            resp: eventId
        });
        dispatch(getActiveGameId(eventId));
        dispatch(getGamesForEvent(eventId));
    });
}

export const getActiveGameId = eventId => dispatch => {
    manageGameplayService.getActiveGame(eventId).then(val => {
        dispatch({
            type: FETCH_ACTIVE_GAME_ID,
            resp: val || ''
        })
    });
}

export const getGamesForEvent = eventId => dispatch => {
    manageGameplayService.getGamesForEvent(eventId).then(val => {
        dispatch({
            type: FETCH_GAMES_FOR_EVENT,
            resp: val
        })
    });
}