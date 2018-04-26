import {replaceContent} from '../utils/domUtils.js';

const postgameResults = function({element}) {

	function render() {
		replaceContent(element, `
			Postgame results
		`);
	}

	return {
		render
	};

};

export default postgameResults;