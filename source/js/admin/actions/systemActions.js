import {
    FETCH_Q_DURATION, 
    ON_Q_DURATION_CHANGE
} from './types';

import listenService from '../services/dbListenService.js';

export const fetchQuestionDuration = () => async dispatch => {
    listenService.listenToQDurationChange(val => {
        dispatch({
            type: FETCH_Q_DURATION,
            resp: val / 1000
        });
    });
}

// like onChange event when user is typing in input
export const onQDurationChange = userInput => dispatch => {
    dispatch({
        type: ON_Q_DURATION_CHANGE,
        resp: userInput
    })
}