import {getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage} from '../utils/localstorageUtils.js';
import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {
	
	const callbacks = [];
	let appHasError = false;
	let initialAppConnect = true;

	async function init() {
		bindBustedAppEvents();
		dbService.getDb().ref('currentEvent').on('value', snapshot => onCurrentEventStateChanged(snapshot.val()));
	}

	function bindBustedAppEvents() {
		dbService.getDb().ref('.info/connected').on('value', snapshot => onErrorStateChanged(snapshot.val() === false));
		dbService.getDb().ref('disableAll').on('value', snapshot => onErrorStateChanged(snapshot.val() === true));
		dbService.getDb().ref('resetApp').on('value', snapshot => onResetAppChanged(snapshot.val() === true));
	}

	function onCurrentEventStateChanged(currentEventId) {
		if (currentEventId) {
			playerService.getAuth().onAuthStateChanged(user => onAuthStateChanged(user, currentEventId));
		} else {
			runSubscribedCallbacks('onNoActiveEvent', {
				message: 'There are no active events at this time.'
			});
		}
	}

	async function onAuthStateChanged(user, currentEventId) {
		if (user) {
			dbService.getDb().ref(`events/${currentEventId}/gameIsInProgress`).on('value', snapshot => onGameInProgressChange(snapshot.val()));
			dbService.getDb().ref(`events/${currentEventId}/activeGameId`).on('value', snapshot => onGameActivationChange(snapshot.val(), currentEventId));
		} else {
			runSubscribedCallbacks('onPlayerUnauthenticated');
		}
	}

	function onGameInProgressChange(gameIsInProgress) {
		if (gameIsInProgress === false) {
			runSubscribedCallbacks('onGameCountdown');
		}
	}

	async function onGameActivationChange(gameId, currentEventId) {
		if (gameId) {
			const gameIsInProgress = await checkIfGameIsInProgress(currentEventId);
			if (gameIsInProgress) {
				runSubscribedCallbacks('onGameCountdown');
			} else {
				const gameVals = await dbService.getActiveGameData(gameId);
				runSubscribedCallbacks('onGameStart', gameVals);
				dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => onQuestionActivationChange(snapshot.val(), gameVals, gameId));
				dbService.getDb().ref(`games/${gameId}/showQuestionResults`).on('value', snapshot => onShowQuestionResultsChange(snapshot.val()));
				dbService.getDb().ref(`games/${gameId}/showGameResults`).on('value', snapshot => onShowGameResultsChange(snapshot.val()));
				dbService.getDb().ref(`games/${gameId}/showGameOver`).on('value', snapshot => onShowGameOverChange(snapshot.val()));
			}
		}
	}

	function onQuestionActivationChange(activeQuestionId, gameVals, gameId) {
		if (activeQuestionId) {
			let activeQuestion = gameVals.questions[activeQuestionId];
			activeQuestion.id = Object.keys(gameVals.questions[activeQuestionId])[0];
			runSubscribedCallbacks('onQuestionAsked', {
				gameId: gameId,
				questionData: activeQuestion
			});
		}
	}

	function onShowQuestionResultsChange(shouldShowQuestionResults) {
		if (shouldShowQuestionResults) {
			runSubscribedCallbacks('onBetweenQuestions', {
				questionData: {
					id: 10,
					order: 0,
					question: 'Who is the most dashing Kansas City Royal of all time?',
					choiceResults: [
						{
							choiceText: 'Bob Hamelin',
							isCorrectChoice: false,
							chosenCount: 28
						},
						{
							choiceText: 'Danny Tartabul',
							isCorrectChoice: false,
							chosenCount: 39
						},
						{
							choiceText: 'Steve Balboni',
							isCorrectChoice: true,
							chosenCount: 142
						}
					]
				}
			});
		}
	}

	function onShowGameResultsChange(shouldShowGameResults) {
		if (shouldShowGameResults) {
			runSubscribedCallbacks('onPostgameResults');
		}
	}

	function onShowGameOverChange(shouldShowGameResults) {
		if (shouldShowGameResults) {
			runSubscribedCallbacks('onGameEnd');
		}
	}

	function onErrorStateChanged(isError = false) {
		if (initialAppConnect === true) {
			initialAppConnect = false;
		} else {
			appHasError = isError;
			if (appHasError === true) {
				runSubscribedCallbacks('onError');
			}
			// else {
			// 	runSubscribedCallbacks('onErrorResolved', {
			// 		message: 'Error resolved, back to normal shortly...'
			// 	});
			// }
		}
		
	}

	function onResetAppChanged(isReset) {
		if (isReset && window.localStorage) {
			const lsKey = 'appHasBeenReset';
			const lsVal = getFromLocalStorage(lsKey);
			if (lsVal) {
				removeFromLocalStorage(lsKey);
			} else if (lsVal === null) {
				if (saveToLocalStorage(lsKey, true)) {
					location.reload();
				}
			}
		}
	}

	function checkIfGameIsInProgress(currentEventId) {
		return dbService.getDb().ref(`events/${currentEventId}/gameIsInProgress`).once('value').then(snapshot => snapshot.val());
	}

	function subscribe(name = null, callback = null) {
		if (name !== null && callback !== null) {
			callbacks.push({
				name: name,
				fn: callback
			});
		}
	}

	function runSubscribedCallbacks(name, response) {
		const subscribedCallBacks = callbacks.filter(callback => callback.name === name);
		subscribedCallBacks.forEach(callback => {
			if (appHasError === false || callback.name === 'onError') {
				callback.fn(response);
			}
		});
	}

	return {
		init,
		subscribe
	};

};

const instance = eventsService();

export default instance;