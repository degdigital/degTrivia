import playerService from './playerService.js';
import dbService from './dbService.js';

const eventsService = function() {

	const callbacks = [];

	async function bindEvents() {
		dbService.init();
		
		dbService.getDb().ref('.info/connected').on('value', snapshot => runSubscribedCallbacks('onErrorStateChanged', snapshot.val() === true));
		dbService.getDb().ref('disableAll').on('value', snapshot => runSubscribedCallbacks('onErrorStateChanged', snapshot.val() === true));
		playerService.getAuth().onAuthStateChanged(user => runSubscribedCallbacks('onAuthStateChanged', user));
		
		const currentEventId = await dbService.getCurrentEventId();
		if (currentEventId) {
			dbService.getDb().ref(`events/${currentEventId}/activeGameId`).on('value', snapshot => {
				const gameId = snapshot.val();
				if (gameId) {
					dbService.getDb().ref(`games/${gameId}`).once('value', snapshot => {
						if (snapshot.exists()) {
							const gameVals = snapshot.val();
							runSubscribedCallbacks('onGameStart', gameVals);
							dbService.getDb().ref(`games/${gameId}/activeQuestionId`).on('value', snapshot => {
								const activeQuestionId = snapshot.val();
								if (activeQuestionId) {
									let activeQuestion = gameVals.questions[activeQuestionId];
									activeQuestion.id = Object.keys(gameVals.questions[activeQuestionId])[0];
									console.log(activeQuestion);
									runSubscribedCallbacks('onQuestionAsked', {
										gameId: gameId,
										questionData: activeQuestion
									});
								} else {
									runSubscribedCallbacks('onBetweenQuestions');
								}
							});
						}
					});
				} else {
					runSubscribedCallbacks('onGameEnd', gameId);
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
		subscribedCallBacks.forEach(callback => callback.fn(response));
	}

	function init() {
		bindEvents();
	}

	return {
		init,
		subscribe
	};

};

const instance = eventsService();

export default instance;