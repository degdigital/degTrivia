import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import leaderboard from '../components/leaderboard.js';

const postgameResults = function(element) {

	function bindEventListeners() {
		const btnEl = document.querySelector('[data-leaderboard-btn]');
		if (btnEl) {
			btnEl.addEventListener('click', routeToLeaderboard);
		}
	}

	function unbindEventListeners() {
		const btnEl = document.querySelector('[data-leaderboard-btn]');
		if (btnEl) {
			btnEl.removeEventListener('click', routeToLeaderboard);
		}
	}

	function routeToLeaderboard() {
		router.route('leaderboard');
	}

	function renderLeaderboardBtn(shouldRender) {
		if (shouldRender) {
			return '<button class="button results-screen__button" data-leaderboard-btn>View the leaderboard</button>';
		}
		return '';
	}

	function render({gameScore, showLeaderboardBtn}) {
		// TODO: replace subheading with content from DB
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				<h2 class="results-screen__score text--centered">Your score: ${gameScore}</h2>
			</div>
			<p class="subheading text--centered">Come visit DEG at booth #303 to learn more about how we can help your company market to the moment.</p>
			${renderLeaderboardBtn(showLeaderboardBtn)}
		`);
		bindEventListeners();
	}

	function teardown() {
		unbindEventListeners();
	}

	return {
		render,
		teardown
	};

};

export default postgameResults;