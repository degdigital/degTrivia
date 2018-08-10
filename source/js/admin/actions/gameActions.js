import {resetGameById} from '../services/gameService';
import {
    GAME_TO_EDIT_UPDATED,
    QUESTION_TO_EDIT_UPDATED,
    QUESTION_REMOVED,
    GAME_QUESTIONS_UPDATED
} from './types';

export const resetGame = gameId => dispatch => {
    resetGameById(gameId);
}

export const setGameToEdit = gameToEdit => dispatch => {
    dispatch({
        type: GAME_TO_EDIT_UPDATED,
        resp: gameToEdit
    })
}

export const setQuestionToEdit = questionToEdit => dispatch => {
    dispatch({
        type: QUESTION_TO_EDIT_UPDATED,
        resp: questionToEdit
    })
}

export const removeQuestion = qId => (dispatch, getState) => {
    dispatch({
        type: QUESTION_REMOVED,
        resp: getState().data.gameToEdit.questions.filter(q => q.id !== qId)
    })
}

export const updateGameQuestion = updatedQuestion => (dispatch, getState) => {
    let newQList = [];
    const currentQList = getState().data.gameToEdit.questions;

    if (updatedQuestion.id) {
        newQList = currentQList.map(q => {
            if (q.id === updatedQuestion.id) {
                return updatedQuestion;
            }
            return q;
        })
    } else {
        const newQ = {
            ...updatedQuestion,
            ...{
                id: Date.now(),
                isNew: true
            }
        }
        newQList = [...currentQList, ...[newQ]];
    }
    
    dispatch({
        type: GAME_QUESTIONS_UPDATED,
        resp: newQList
    })
}