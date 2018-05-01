import {getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage} from '../utils/localstorageUtils.js';
import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {
	
	const callbacks = [];
	let currentEventId;
	let appHasError = false;

	async function init() {
		currentEventId = await dbService.getCurrentEventId();
		bindBustedAppEvents();
		if (currentEventId) {
			playerService.getAuth().onAuthStateChanged(user => onAuthStateChanged(user, currentEventId));
		} else {
			runSubscribedCallbacks('onNoActiveEvent', {
				message: 'There are no active events at this time.'
			});
		}
	}

	function bindBustedAppEvents() {
		dbService.getDb().ref('.info/connected').on('value', snapshot => onErrorStateChanged(snapshot.val() === false));
		dbService.getDb().ref('disableAll').on('value', snapshot => onErrorStateChanged(snapshot.val() === true));
		dbService.getDb().ref('resetApp').on('value', snapshot => onResetAppChanged(snapshot.val() === true));

	}

	function onErrorStateChanged(isError) {
		appHasError = isError;
		if (appHasError === true) {
			runSubscribedCallbacks('onError');
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

	async function onAuthStateChanged(user, currentEventId) {
		if (user) {
			dbService.getDb().ref(`events/${currentEventId}/gameIsInProgress`).on('value', snapshot => onGameInProgressChange(snapshot.val()));
		} else {
			dbService.getDb().ref(`events/${currentEventId}/activeGameId`).off();
			runSubscribedCallbacks('onPlayerUnauthenticated', user);
		}
	}

	async function onGameInProgressChange(gameIsInProgress) {
		if (gameIsInProgress) {
			runSubscribedCallbacks('onGameCountdown');
		} else {
			dbService.getDb().ref(`events/${currentEventId}/gameIsInProgress`).off();
			dbService.getDb().ref(`events/${currentEventId}/activeGameId`).on('value', snapshot => onGameActivationChange(snapshot.val()));
		}
	}

	async function onGameActivationChange(gameId) {
		if (gameId) {
			const gameVals = await dbService.getActiveGameData(gameId);
			runSubscribedCallbacks('onGameStart', gameVals);
			dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => onQuestionActivationChange(snapshot.val(), gameVals, gameId));
			dbService.getDb().ref(`games/${gameId}/activeResultsId`).on('value', snapshot => onResultsActivationChange(snapshot.val(), gameVals, gameId));

		} else {
			dbService.getDb().ref(`games/${gameId}/activeQuestionId`).off();
			dbService.getDb().ref(`games/${gameId}/activeResultsId`).off();
			const gameIsInProgress = await dbService.getDb().ref(`events/${currentEventId}/gameIsInProgress`).once('value').then(snapshot => onGameInProgressChange(snapshot.val()));
			if (gameIsInProgress) {
				runSubscribedCallbacks('onPostgameResults');
			} else {
				runSubscribedCallbacks('onGameEnd');
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

	function onResultsActivationChange(activeResultsId, gameVals, gameId) {
		if (activeResultsId) {
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
			if (appHasError === false || (appHasError === true && callback.name === 'onError')) {
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