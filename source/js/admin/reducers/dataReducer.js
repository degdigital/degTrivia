import { FETCH_PLAYERS, FETCH_EVENTS, FETCH_Q_DURATION } from '../actions/types';

const initQuestionState = {
    duration: 0
};

const initialState = {
    events: [],
    players: [],
    question: initQuestionState,
    isAppDisabled: false
}


export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PLAYERS:
            return {
                ...state,
                players: action.resp
            }
        case FETCH_EVENTS:
            return {
                ...state,
                events: action.resp
            }
        case FETCH_Q_DURATION:
            return {
                ...state,
                question: {
                    ...state.question,
                    duration: action.resp
                }
            }
        default:
            return state;
    }
}