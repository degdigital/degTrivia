import immutable from 'object-path-immutable';

import { 
    PLAYERS_CHANGED, 
    EVENTS_RECEIVED,
    GAMES_FOR_EVENT_RECEIVED,
    DB_Q_DURATION_CHANGED, 
    FORM_Q_DURATION_CHANGED,
    APP_STATUS_RECEIVED,
    ACTIVE_EVENT_CHANGED,
    ACTIVE_GAME_CHANGED,
    ACTIVE_QUESTION_CHANGED,
    QS_FOR_GAME_RECEIVED,
    ROTATING_COPY_UPDATED
} from '../actions/types';

const initQuestionState = {
    duration: 0
};

const initialState = {
    events: [],
    players: [],
    games: [],
    questions: [],
    question: initQuestionState,
    isAppDisabled: false,
    activeEventId: ''
}


export default (state = initialState, action) => {
    switch (action.type) {
        case PLAYERS_CHANGED:
            return {
                ...state,
                players: action.resp
            }
        case EVENTS_RECEIVED:
            return {
                ...state,
                events: action.resp
            }
        case GAMES_FOR_EVENT_RECEIVED: 
            return {
                ...state,
                games: action.resp
            }
        case QS_FOR_GAME_RECEIVED:
            return {
                ...state,
                questions: action.resp
            }
        case DB_Q_DURATION_CHANGED:
            return {
                ...state,
                question: {
                    ...state.question,
                    duration: action.resp
                }
            }
        case FORM_Q_DURATION_CHANGED:
            return {
                ...state,
                question: {
                    ...state.question,
                    duration: action.resp
                }
            }
        case APP_STATUS_RECEIVED:
            return {
                ...state,
                isAppDisabled: action.resp
            }
        case ACTIVE_EVENT_CHANGED:
            return {
                ...state,
                activeEventId: action.resp
            }
        case ACTIVE_GAME_CHANGED:
            return {
                ...state,
                activeGameId: action.resp
            }
        case ACTIVE_QUESTION_CHANGED:
            return {
                ...state,
                activeQuestionId: action.resp
            }
        case ROTATING_COPY_UPDATED:
            const newRotatingCopyObj = immutable.merge(state, `events/${action.eventId}/pregameRotatingCopy`, action.newItem)
            return {
                ...state,
                ...newRotatingCopyObj
            }
        default:
            return state;
    }
}