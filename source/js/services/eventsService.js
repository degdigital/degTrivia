import playerService from './playerService.js';

const eventsService = function() {

	const callbacks = [];

	function bindEvents() {
		playerService.getAuth().onAuthStateChanged(user => runSubscribedCallbacks('onAuthStateChanged', user));
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