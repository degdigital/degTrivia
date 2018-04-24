import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const leaderboardScreen = function(config) {

	const leaderboardInst = leaderboard();

	function init() {}

	function render() {
		leaderboardInst.renderToElement(config.element);
	}

	init();

	return {
		render
	};

};

export default leaderboardScreen;