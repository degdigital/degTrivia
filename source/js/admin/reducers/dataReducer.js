import { FETCH_PLAYERS, FETCH_EVENTS } from '../actions/types';

const initialState = {
    events: [],
    players: []
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
        default:
            return state;
    }
}