import { FETCH_PLAYERS } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_PLAYERS:
            return action.resp;
        default:
            return state;
    }
}