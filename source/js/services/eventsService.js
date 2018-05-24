import {getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage} from '../utils/localstorageUtils.js';
import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {
	
	const callbacks = [];
	let appHasError = false;
	let initialAppLoad = true;
	let initialDbConnect = true;

	function init() {
		bindBustedAppEvents();
		dbService.getDb().ref('activeEventId').on('value', snapshot => onActiveEventStateChanged(snapshot.val()));
	}

	function bindBustedAppEvents() {
		dbService.getDb().ref('.info/connected').on('value', snapshot => onDbConnectionStateChange(snapshot.val() === true));
		dbService.getDb().ref('disableAll').on('value', snapshot => onErrorStateChanged(snapshot.val() === true));
		dbService.getDb().ref('resetApp').on('value', snapshot => onResetAppChanged(snapshot.val() === true));
	}

	async function onActiveEventStateChanged(activeEventId) {
		let eventData = null;

		if (activeEventId) {
			playerService.getAuth().onAuthStateChanged(user => onAuthStateChanged(user, activeEventId));
			eventData = await dbService.getEventById(activeEventId);
		} else {
			runSubscribedCallbacks('onNoActiveEvent', {
				message: 'There are no active events at this time.'
			});
		}

		runSubscribedCallbacks('onActiveEventChanged', eventData);
	}

	function onAuthStateChanged(user, activeEventId) {
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
			dbService.getDb().ref(`games/${gameId}/showQuestionResults`).on('value', snapshot => onQuestionResultsChange(snapshot.val(), gameId));
			dbService.getDb().ref(`games/${gameId}/showGameResults`).on('value', snapshot => onShowGameResultsChange(snapshot.val()));
			dbService.getDb().ref(`games/${gameId}/showGameOver`).on('value', snapshot => onShowGameOverChange(snapshot.val()));
		} else {
			const eventVals = await dbService.getEventById(activeEventId);
			runSubscribedCallbacks('onGameCountdown', eventVals);
		}
	}

	async function onQuestionActivationChange(activeQuestionId, gameVals, gameId) {
		if (activeQuestionId) {
			const questionExpirationTime = await dbService.getQuestionExpirationTime(gameId);
			let activeQuestion = gameVals.questions[activeQuestionId];
			activeQuestion.id = activeQuestionId;
			activeQuestion.expirationTime = questionExpirationTime;
			runSubscribedCallbacks('onQuestionAsked', {
				gameId: gameId,
				questionData: activeQuestion
			});
		}
	}

	async function onQuestionResultsChange(questionId, gameId) {
		if (questionId !== false) {
			const questionResults = await dbService.getQuestionResults(gameId, questionId);
			runSubscribedCallbacks('onQuestionResults', questionResults);
		}
	}

	async function onShowGameResultsChange(shouldShowGameResults) {
		if (shouldShowGameResults) {
			const gameScore = await dbService.getPlayerScore(playerService.getAuth().currentUser.uid);
			runSubscribedCallbacks('onPostgameResults', gameScore);
		}
	}

	function onShowGameOverChange(shouldShowGameResults) {
		if (shouldShowGameResults) {
			runSubscribedCallbacks('onGameEnd');
		}
	}

	function onDbConnectionStateChange(isConnected) {
		if (initialAppLoad === true) {
			initialAppLoad = false;
		} else if (initialDbConnect === true) {
			initialDbConnect = false;
		} else {
			if (isConnected === true) {
				runSubscribedCallbacks('onDatabaseReconnect');
			} else {
				onErrorStateChanged(true);
			}
		}
	}

	function onErrorStateChanged(isError = false) {
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
			if (appHasError === false || callback.name === 'onError' || callback.name === 'onDatabaseReconnect') {
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