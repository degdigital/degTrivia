import {replaceContent} from '../utils/domUtils.js';

const screenTemplate = function(config) {

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