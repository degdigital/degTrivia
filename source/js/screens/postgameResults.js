import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const postgameResults = function(element) {
	const leaderboardContainerClass = 'leaderboard-container';

	function render(gameScore) {
		replaceContent(element, `
			Your game score was ${gameScore}
			<div class="${leaderboardContainerClass}"></div>
		`);
		leaderboard().renderToElement(document.querySelector(`.${leaderboardContainerClass}`))
	}

	return {
		render
	};

};

export default postgameResults;