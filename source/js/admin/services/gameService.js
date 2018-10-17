import dbService from '../../services/dbService.js';
import {objToArray, arrayToObj, replaceNewIds} from './utils/dbUtils';

// takes FB structure and flattens it for component use
export function flattenObj(gameObj) {
    const retVal = {};
	
	Object.keys(gameObj).map(key => {
		if (typeof gameObj[key] === 'object') {
			retVal[key] = objToArray(gameObj[key]);
		} else {
			retVal[key] = gameObj[key];
		}	
	})

    return retVal;
}

export function buildObj(formVals) {
	const retVal = {};
	const ref = dbService.getDb().ref('games');
	
	Object.keys(formVals).map(key => {
		if (typeof formVals[key] === 'object' && formVals[key].length) {
			const valList = formVals[key].map(item => replaceNewIds(ref, item));
			retVal[key] = arrayToObj(valList);
		} else if (typeof formVals[key] !== 'function') {
			retVal[key] = formVals[key];
		}	
	})

    return retVal;
}

export function saveGameInDb(gameObj) {
	const ref = dbService.getDb().ref('games');
	const formattedGameObj = replaceNewIds(ref, gameObj)

	let key = ref.push().key; 
	if (formattedGameObj.id) {
		key = formattedGameObj.id;
		delete formattedGameObj.id;
	}

    ref.update({
        [key]: buildObj(formattedGameObj)
    });
}

export function resetGameById(gameId) {
	dbService.getDb().ref(`games/${gameId}`).update({
		activeQuestionId: false,
		showBetweenQuestions: false,
		showGameOver: false,
		showGameResults: false,
		showQuestionResults: false
	})
}

export function generateKey() {
	return dbService.getDb().ref('games').push().key;
}