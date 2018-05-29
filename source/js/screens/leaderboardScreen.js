import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const leaderboardScreen = function(element) {
	const leaderboardContainerClass = 'leaderboard-container';

	function render() {
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				<p class="subheading text--centered">Congrats on seeing your name in lights. Don't let someone steal your thunder. Play again to maintain your spot.</p>
			</div>

			<div class="${leaderboardContainerClass}"></div>
		`);
		leaderboard().renderToElement(document.querySelector(`.${leaderboardContainerClass}`))
	}

	return {
		render
	};

};

export default leaderboardScreen;