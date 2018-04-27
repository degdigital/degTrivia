import {replaceContent} from '../utils/domUtils.js';
import leaderboard from '../components/leaderboard.js';

const leaderboardScreen = function({element}) {

	function render() {
		leaderboard().renderToElement(element);
	}

	return {
		render
	};

};

export default leaderboardScreen;