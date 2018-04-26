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
					runSubscribedCallbacks('onGameStart', {
						gameId: gameId,
						questionData: {
							id: 10,
							order: 0,
							question: 'Who is the most dashing Kansas City Royal of all time?',
							choices: {
								100: 'Bob Hamelin',
								101: 'Danny Tartabul',
								102: 'Steve Balboni' 
							}
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