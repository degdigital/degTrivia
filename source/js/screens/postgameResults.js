import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import leaderboard from '../components/leaderboard.js';

const postgameResults = function(element) {

	const buttonAttr = 'data-leaderboard-btn';
	let cachedEventVals;

	function bindEventListeners() {
		const btnEl = document.querySelector(`[${buttonAttr}]`);
		if (btnEl) {
			btnEl.addEventListener('click', routeToLeaderboard);
		}
	}

	function unbindEventListeners() {
		const btnEl = document.querySelector(`[${buttonAttr}]`);
		if (btnEl) {
			btnEl.removeEventListener('click', routeToLeaderboard);
		}
	}

	function routeToLeaderboard() {
		router.route('leaderboard', cachedEventVals);
	}

	function renderLeaderboardBtn(shouldRender) {
		if (shouldRender) {
			return `
				<button class="button results-screen__button" ${buttonAttr}>View the leaderboard</button>
			`;
		}
		return '';
	}

	function render({gameScore, showLeaderboard, eventVals}) {
		cachedEventVals = eventVals;
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				<h2 class="results-screen__score text--centered">Your score: ${gameScore}</h2>
			</div>
			${renderDescription(eventVals.postgameResultsCopy.description)}
			${renderLeaderboardBtn(showLeaderboard)}
		`);
		bindEventListeners();
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