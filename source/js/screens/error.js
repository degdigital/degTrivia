import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import eventsService from '../services/eventsService.js';

const error = function({element}) {

	function bindEvents() {
		eventsService.subscribe('onErrorStateChanged', render);
	}

	function render(isError = false) {
		if (isError) {
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