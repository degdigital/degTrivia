import { FETCH_PLAYERS, FETCH_EVENTS } from './types';

import listenService from '../services/dbListenService.js';

export const fetchPlayers = () => async dispatch => {
    listenService.listenToPlayersChange(resp => {
        dispatch({
            type: FETCH_PLAYERS,
            resp: resp
        })
    })
}

export const fetchEvents = () => async dispatch => {
    listenService.listenToEventsChange(resp => {
        dispatch({
            type: FETCH_EVENTS,
            resp: resp
        })
    })
}

export const fetchQuestionDuration = () => async dispatch => {
    listenService.listenToQDurationChange(val => {
        dispatch({
            type: FETCH_Q_DURATION,
            resp: val / 1000
        });
    });
}
