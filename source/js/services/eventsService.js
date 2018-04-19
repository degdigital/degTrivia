import authService from './authService.js';

const eventsService = function() {

	const callbacks = [];

	function bindEvents() {
		authService.auth.onAuthStateChanged(user => runSubscribedCallbacks('onAuthStateChanged', user));
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

	bindEvents();
	
	return {
		subscribe
	};

};

const instance = eventsService();

export default instance;