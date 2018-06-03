import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const leaderboardScreen = function(element) {
	const leaderboardContainerClass = 'leaderboard-container';

	function render(eventVals) {
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				${renderDescription(eventVals.leaderboardCopy.description)}
			</div>
			<div class="${leaderboardContainerClass}"></div>
		`);
		leaderboard().renderToElement(document.querySelector(`.${leaderboardContainerClass}`))
	}

	function renderDescription(description = null) {
		if (!description) {
			return '';
		}
		return `
			<p class="subheading text--centered">${description}</p>
		`;
	}

	return {
		render
	};

};

export default leaderboardScreen;