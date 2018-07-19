import {
    FETCH_PLAYERS
} from './types';

import listenService from '../services/dbListenService';

export const fetchPlayers = () => async dispatch => {
    listenService.listenToPlayersChange(resp => {
        dispatch({
            type: FETCH_PLAYERS,
            resp: resp
        })
    })
}