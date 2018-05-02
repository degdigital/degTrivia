import {replaceContent} from '../utils/domUtils.js';

const screenTemplate = function({element}) {

	function init() {

	}

	function render() {
		replaceContent(element, `
			Screen Template
		`);
	}

	function teardown() {
		//cleanup, i.e. unsubscribing event listeners 
	}

	init();

	return {
		render,
		teardown
	};

};

export default screenTemplate;