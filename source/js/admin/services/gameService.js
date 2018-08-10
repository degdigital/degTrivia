import dbService from '../../services/dbService.js';
import {objToArray, arrayToObj} from './utils/dbUtils';

// takes FB structure and flattens it for component use
export function formatObj(gameObj) {
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
	
	Object.keys(formVals).map(key => {
		if (typeof formVals[key] === 'object' && formVals[key].length) {
			retVal[key] = arrayToObj(formVals[key]);
		} else if (typeof formVals[key] !== 'function') {
			retVal[key] = formVals[key];
		}	
	})

    return retVal;
}

// // takes form vals and returns an object with fb structure
// export function buildEventObject(formVals) {
//     const retVal = {};

//     retVal.activeGameId = formVals.activeGameId || false;
//     retVal.alias = formVals.alias;
//     retVal.betweenQuestionsCopy = {
//         title: formVals.gameBetweenQuestionsCopyTitle,
//         description: formVals.gameBetweenQuestionsCopyDescription
//     };
//     retVal.gameWaitBeforeQuestionsCopy = {
//         title: formVals.gameWaitBeforeQuestionsCopyTitle,
//         description: formVals.gameWaitBeforeQuestionsCopyDescription
//     };
//     retVal.games = formVals.games || false;
//     retVal.hashtag = formVals.hashtag;
//     retVal.leaderboardCopy = {
//         description: formVals.leaderboardCopyDescription
//     };
//     retVal.name = formVals.name;
//     retVal.postgameResultsCopy = {
//         description: formVals.postgameResultsCopyDescription
//     };
//     retVal.registrationCopy = {
//         title: formVals.registrationCopyTitle,
//         disclosure: formVals.registrationCopyDisclosure
//     };
//     retVal.url = formVals.url;

//     return retVal;
// }

// export function saveEvent(eventObj, eventId) {
//     const ref = dbService.getDb().ref('events');
//     const key = eventId || ref.push().key;

//     ref.update({
//         [key]: eventObj
//     });
// }

export function resetGameById(gameId) {
	dbService.getDb().ref(`games/${gameId}`).update({
		activeQuestionId: false,
		showBetweenQuestions: false,
		showGameOver: false,
		showGameResults: false,
		showQuestionResults: false
	})
}