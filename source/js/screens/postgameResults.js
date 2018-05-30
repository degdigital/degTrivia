import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import leaderboard from '../components/leaderboard.js';

const postgameResults = function(element) {

	function bindEventListeners(eventVals) {
		const btnEl = document.querySelector('[data-leaderboard-btn]');
		if (btnEl) {
			btnEl.addEventListener('click', routeToLeaderboard, eventVals);
		}
	}

	function unbindEventListeners() {
		const btnEl = document.querySelector('[data-leaderboard-btn]');
		if (btnEl) {
			btnEl.removeEventListener('click', routeToLeaderboard);
		}
	}

	function routeToLeaderboard(eventVals) {
		router.route('leaderboard', eventVals);
	}

	function renderLeaderboardBtn(shouldRender) {
		if (shouldRender) {
			return '<button class="button results-screen__button" data-leaderboard-btn>View the leaderboard</button>';
		}
		return '';
	}

	function render({gameScore, showLeaderboard, eventVals}) {
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				<h2 class="results-screen__score text--centered">Your score: ${gameScore}</h2>
			</div>
			${renderDescription(eventVals.postgameResultsCopy.description)}
			${renderLeaderboardBtn(showLeaderboard)}
		`);
		bindEventListeners(eventVals);
	}

	function renderDescription(description = null) {
		if (!description) {
			return '';
		}
		return `
			<p class="subheading text--centered">${description}</p>
		`;
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