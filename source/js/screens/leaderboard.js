import {replaceContent} from '../utils/domUtils.js';

const leaderboard = function({element}) {

	function render() {
		replaceContent(element, `
			Leaderboard
		`);
	}

	return {
		render
	};

};

export default leaderboard;