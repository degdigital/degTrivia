import {
    PLAYERS_CHANGED
} from './types';

import listenService from '../services/dbListenService';

export const fetchPlayers = () => async dispatch => {
    listenService.listenToPlayersChange(resp => {
        dispatch({
            type: PLAYERS_CHANGED,
            resp: resp
        })
    })
}