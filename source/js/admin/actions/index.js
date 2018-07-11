import { FETCH_PLAYERS } from './types';

import listenService from '../services/dbListenService.js';

export const fetchPlayers = () => async dispatch => {
    listenService.listenToPlayersChange(resp => {
        dispatch({
            type: FETCH_PLAYERS,
            resp: resp
        })
    })
}