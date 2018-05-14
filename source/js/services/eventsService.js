import {getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage} from '../utils/localstorageUtils.js';
import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {
	
	const callbacks = [];
	let appHasError = false;
	let initialAppConnect = true;

	async function init() {
		bindBustedAppEvents();
		dbService.getDb().ref('activeEventId').on('value', snapshot => onActiveEventStateChanged(snapshot.val()));
	}

	function bindBustedAppEvents() {
		dbService.getDb().ref('.info/connected').on('value', snapshot => onErrorStateChanged(snapshot.val() === false));
		dbService.getDb().ref('disableAll').on('value', snapshot => onErrorStateChanged(snapshot.val() === true));
		dbService.getDb().ref('resetApp').on('value', snapshot => onResetAppChanged(snapshot.val() === true));
	}

	function onActiveEventStateChanged(activeEventId) {
		if (activeEventId) {
			playerService.getAuth().onAuthStateChanged(user => onAuthStateChanged(user, activeEventId));
		} else {
			runSubscribedCallbacks('onNoActiveEvent', {
				message: 'There are no active events at this time.'
			});
		}
	}

	async function onAuthStateChanged(user, activeEventId) {
		if (user) {
			dbService.getDb().ref(`events/${activeEventId}/activeGameId`).on('value', snapshot => onGameActivationChange(snapshot.val(), activeEventId));
		} else {
			runSubscribedCallbacks('onPlayerUnauthenticated');
		}
	}

	async function onGameActivationChange(gameId, activeEventId) {
		if (gameId) {
			const gameVals = await dbService.getActiveGameData(gameId);
			runSubscribedCallbacks('onGameStart', gameVals);
			dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => onQuestionActivationChange(snapshot.val(), gameVals, gameId));
			dbService.getDb().ref(`games/${gameId}/showQuestionResults`).on('value', snapshot => onShowQuestionResultsChange(snapshot.val()));
			dbService.getDb().ref(`games/${gameId}/showGameResults`).on('value', snapshot => onShowGameResultsChange(snapshot.val()));
			dbService.getDb().ref(`games/${gameId}/showGameOver`).on('value', snapshot => onShowGameOverChange(snapshot.val()));
		}
	}

	function onQuestionActivationChange(activeQuestionId, gameVals, gameId) {
		if (activeQuestionId) {
			let activeQuestion = gameVals.questions[activeQuestionId];
			activeQuestion.id = activeQuestionId;
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
					correctChoice: 102,
					choices: {
						100: {
							text: 'Bob Hamelin',
							chosenCount: 28
						},
						101: {
							text: 'Danny Tartabul',
							chosenCount: 39
						},
						102: {
							text: 'Steve Balboni',
							chosenCount: 142
						}
					}
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