import {replaceContent} from '../utils/domUtils.js';

const gameLanding = function({element}) {

	function render() {
		replaceContent(element, `
			gameLanding
		`);
		
	}

	return {
		render
	};

};

export default gameLanding;