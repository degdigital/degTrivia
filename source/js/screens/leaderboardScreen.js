import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';
import tabs from '../components/tabs.js';

const leaderboardScreen = function(element) {
	const classes = {
		gameSection: 'tab-section--game',
		eventSection: 'tab-section--event',
		tabContainer: 'tabs-container'
	}
	let tabInst;

	function renderLeaderboards() {
		const leaderboardInst = leaderboard();
		leaderboardInst.renderToElement(document.querySelector(`.${classes.gameSection}`), 'game');
		leaderboardInst.renderToElement(document.querySelector(`.${classes.eventSection}`), 'event');
	}

	function render(eventVals) {
		replaceContent(element, `
			<div class="results-screen__intro">
				<h1 class="page-title page-title--centered">Game Results</h1>
				${renderDescription(eventVals.leaderboardCopy.description)}
			</div>
			<div class="${classes.tabContainer}">
				<div class="tab-section ${classes.gameSection}" data-tab-name="Game"></div>
				<div class="tab-section ${classes.eventSection} is-hidden" data-tab-name="Event"></div>
			</div>
		`);
		
		tabInst = tabs(document.querySelector(`.${classes.tabContainer}`));
		renderLeaderboards();
	}

	function teardown() {
		tabInst.destroy();
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
		render,
		teardown
	};

};

export default leaderboardScreen;