import {
    DB_Q_DURATION_CHANGED, 
    FORM_Q_DURATION_CHANGED
} from './types';

import listenService from '../services/dbListenService.js';

export const fetchQuestionDuration = () => async dispatch => {
    listenService.listenToQDurationChange(val => {
        dispatch({
            type: DB_Q_DURATION_CHANGED,
            resp: val / 1000
        });
    });
}

// like onChange event when user is typing in input
export const onQDurationChange = userInput => dispatch => {
    dispatch({
        type: FORM_Q_DURATION_CHANGED,
        resp: userInput
    })
}