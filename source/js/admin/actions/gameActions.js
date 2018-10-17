import {resetGameById, saveGameInDb} from '../services/gameService';
import {getGeneratedQuestion} from '../services/generatedQuestionService';
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
    let qList = getState().data.gameToEdit.questions.filter(q => q.id !== qId);
    qList = qList.map((q, index) => {
        q.order = index
        return q;
    });

    dispatch({
        type: QUESTION_REMOVED,
        resp: qList
    })
}

export const updateGameQuestion = updatedQuestion => (dispatch, getState) => {
    let newQList = [];
    const currentQList = getState().data.gameToEdit.questions || [];

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

    // resetting order on question changes
    newQList = [...newQList].map((q, index) => {
        q.order = index;
        return q;
    })
    
    dispatch({
        type: GAME_QUESTIONS_UPDATED,
        resp: newQList
    })
}

export const saveGame = newGameVals => (dispatch, getState) => {
    const newGameObj = {
        ...getState().data.gameToEdit,
        ...newGameVals
    };

    saveGameInDb(newGameObj);
}

export const generateQuestion = () => dispatch => {
    getGeneratedQuestion().then(resp => {
        dispatch(setQuestionToEdit(resp));
    })
}