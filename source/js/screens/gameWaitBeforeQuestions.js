import {replaceContent} from '../utils/domUtils.js';

const gameWaitBeforeQuestions = function({element}) {

	function render() {
		replaceContent(element, `
			Game has started! Waiting for the first question...
		`);
	}

	return {
		render
	};

};

export default gameWaitBeforeQuestions;