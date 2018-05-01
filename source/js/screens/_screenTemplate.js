import {replaceContent} from '../utils/domUtils.js';

const screenTemplate = function({element}) {

	function init() {

	}

	function render() {
		replaceContent(element, `
			Screen Template
		`);
	}

	init();

	return {
		render
	};

};

export default screenTemplate;