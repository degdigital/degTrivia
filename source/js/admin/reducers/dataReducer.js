import { 
    FETCH_PLAYERS, 
    FETCH_EVENTS, 
    FETCH_Q_DURATION, 
    ON_Q_DURATION_CHANGE,
    FETCH_APP_STATUS,
    FETCH_ACTIVE_EVENT
} from '../actions/types';

const initQuestionState = {
    duration: 0
};

const initialState = {
    events: [],
    players: [],
    question: initQuestionState,
    isAppDisabled: false,
    activeEventId: ''
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
        case ON_Q_DURATION_CHANGE:
            return {
                ...state,
                question: {
                    ...state.question,
                    duration: action.resp
                }
            }
        case FETCH_APP_STATUS:
            return {
                ...state,
                isAppDisabled: action.resp
            }
        case FETCH_ACTIVE_EVENT:
            return {
                ...state,
                activeEventId: action.resp
            }
        default:
            return state;
    }
}