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
				heading: 'Bad timing.',
				message: 'There are no active events at this time.'
			});
		}

		runSubscribedCallbacks('onActiveEventChanged', eventData);
	}

	async function onAuthStateChanged(user, activeEventId) {
		if (!user) {
			handleUnauthenticatedUser(activeEventId);
		} else {
			const playerInfo = await playerService.getCurrentPlayerInfo(user.uid);
			if (playerInfo) {
				dbService.getDb().ref(`events/${activeEventId}/activeGameId`).on('value', snapshot => onGameActivationChange(snapshot.val(), activeEventId));
			} else {
				handleUnauthenticatedUser(activeEventId);
			}
		}
	}

	async function handleUnauthenticatedUser(activeEventId) {
		const eventData = await dbService.getEventById(activeEventId);
		runSubscribedCallbacks('onPlayerUnauthenticated', eventData);
	}

	async function onGameActivationChange(gameId, activeEventId) {
		if (gameId) {
			const responses = await Promise.all([
				dbService.getActiveGameData(gameId),
				dbService.getEventById(activeEventId)
			]);
			const gameVals = responses[0];
			const eventVals = responses[1];
			runSubscribedCallbacks('onGameStart', eventVals);
			dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => onQuestionActivationChange(snapshot.val(), gameVals, gameId));
			dbService.getDb().ref(`games/${gameId}/showQuestionResults`).on('value', snapshot => onQuestionResultsChange(snapshot.val(), gameVals, gameId));
			dbService.getDb().ref(`games/${gameId}/showGameResults`).on('value', snapshot => onShowGameResultsChange(snapshot.val(), eventVals));
			dbService.getDb().ref(`games/${gameId}/showGameOver`).on('value', snapshot => onShowGameOverChange(snapshot.val(), eventVals));
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
			activeQuestion.countText = getQuestionCountText(gameVals.questions, activeQuestionId);
			runSubscribedCallbacks('onQuestionAsked', {
				gameId: gameId,
				questionData: activeQuestion
			});
		}
	}

	async function onQuestionResultsChange(questionId, gameVals, gameId) {
		if (questionId !== false) {
			const uid = playerService.getAuth().currentUser.uid;
			let questionResults = await dbService.getQuestionResults(gameId, questionId, uid);
			questionResults.countText = getQuestionCountText(gameVals.questions, questionId);
			runSubscribedCallbacks('onQuestionResults', questionResults);
		}
	}

	async function onShowGameResultsChange(shouldShowGameResults, eventVals) {
		if (shouldShowGameResults) {
			const gameScore = await dbService.getPlayerScore(playerService.getAuth().currentUser.uid);
			runSubscribedCallbacks('onPostgameResults', {gameScore, showLeaderboard: true, eventVals});
		}
	}

	async function onShowGameOverChange(shouldShowGameResults, eventVals) {
		if (shouldShowGameResults) {
			const gameScore = await dbService.getPlayerScore(playerService.getAuth().currentUser.uid);
			runSubscribedCallbacks('onPostgameResults', {gameScore, showLeaderboard: false, eventVals});
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

	function getQuestionCountText(questions, questionId) {
		if (!questions || !questionId) {
			return null;
		}
		const questionsKeys = Object.keys(questions);
		const questionsCount = questionsKeys.length;
		const questionSpot = questionsKeys.indexOf(questionId) + 1;
		return `Question ${questionSpot} of ${questionsCount}`;
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