import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';

const error = function(element) {


	function render(isError = false) {
		replaceContent(element, `
			Error
		`);
	}

	return {
		render
	};

};

export default error;