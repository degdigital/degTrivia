import {resetGameById} from '../services/gameService';

export const resetGame = gameId => dispatch => {
    resetGameById(gameId);
}