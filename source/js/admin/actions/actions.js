import { 
    FETCH_PLAYERS,
    FETCH_EVENTS, 
    FETCH_Q_DURATION, 
    ON_Q_DURATION_CHANGE, 
    FETCH_APP_STATUS,
    FETCH_ACTIVE_EVENT
} from './types';

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

export const fetchAppStatus = () => async dispatch => {
    listenService.listenToAppDisableChange(val => {
        dispatch({
            type: FETCH_APP_STATUS,
            resp: val
        });
    });
}

export const fetchActiveEventId = () => dispatch => {
    listenService.listenToActiveEventChange(val => {
        dispatch({
            type: FETCH_ACTIVE_EVENT,
            resp: val
        })
    })
} 

// like onChange event when user is typing in input
export const onQDurationChange = userInput => dispatch => {
    dispatch({
        type: ON_Q_DURATION_CHANGE,
        resp: userInput
    })
}
