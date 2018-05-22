import {replaceContent} from '../utils/domUtils.js';

const info = function(element) {

	function render({message}) {
		replaceContent(element, `
			${message}
		`);
	}

	return {
		render
	};

};

export default info;