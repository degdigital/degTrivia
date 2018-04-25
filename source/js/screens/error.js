import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import eventsService from '../services/eventsService.js';

const error = function({element}) {

	function bindEvents() {
		eventsService.subscribe('onConnectionStateChanged', render);
	}

	function render(isConnected = true) {
		if (!isConnected) {
			replaceContent(element, `
				Error
			`);
		} else {
			router.route('gameLanding');
		}
	}

	bindEvents();

	return {
		render
	};

};

export default error;