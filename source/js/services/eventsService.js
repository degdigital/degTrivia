import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {
	
	const callbacks = [];
	const eventNames = {
		onErrorStateChanged: 'onErrorStateChanged'
	};
	let currentEventId;

	async function init() {
		currentEventId = await dbService.getCurrentEventId();
		bindBustedAppEvents();
		if (currentEventId) {
			playerService.getAuth().onAuthStateChanged(user => {
				if (user) {
					dbService.getDb().ref(`events/${currentEventId}/activeGameId`).on('value', snapshot => onGameActivationChange(snapshot.val()));
				} else {
					dbService.getDb().ref(`events/${currentEventId}/activeGameId`).off();
					runSubscribedCallbacks('onPlayerUnauthenticated', user);
				}
			});
		}
	}

	function bindBustedAppEvents() {
		dbService.getDb().ref('.info/connected').on('value', snapshot => runSubscribedCallbacks(eventNames.onErrorStateChanged, snapshot.val() === false));
		dbService.getDb().ref('disableAll').on('value', snapshot => runSubscribedCallbacks(eventNames.onErrorStateChanged, snapshot.val() === true));
	}

	async function onGameActivationChange(gameId) {
		if (gameId) {
			const gameVals = await dbService.getActiveGameData(gameId);
			runSubscribedCallbacks('onGameStart', gameVals);
			dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => onQuestionActivationChange(snapshot.val(), gameVals, gameId));
		} else {
			runSubscribedCallbacks('onGameEnd');
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
		} else {
			runSubscribedCallbacks('onBetweenQuestions');
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
		subscribedCallBacks.forEach(callback => callback.fn(response));
	}

	return {
		init,
		subscribe
	};

};

const instance = eventsService();

export default instance;