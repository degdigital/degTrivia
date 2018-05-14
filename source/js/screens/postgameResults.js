import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const postgameResults = function({element}) {

	function render(gameScore) {
		replaceContent(element, `
			Your game score was ${gameScore}
			${leaderboard().renderToElement(element)};
		`);
	}

	return {
		render
	};

};

export default postgameResults;