// Utils
import router from './utils/router.js';

// Screens
import info from './screens/info.js'
import registration from './screens/registration.js';
import pregameCountdown from './screens/pregameCountdown.js';
import gameWaitBeforeQuestions from './screens/gameWaitBeforeQuestions.js';
import gameQuestion from './screens/gameQuestion.js';
import gameQuestionResults from './screens/gameQuestionResults.js';
import postgameResults from './screens/postgameResults.js';
import leaderboard from './screens/leaderboardScreen.js';
import error from './screens/error.js';

function init(el, appConfig) {

	const routes = {
		info: info(el),
		registration: registration(el),
		pregameCountdown: pregameCountdown(el),
		gameWaitBeforeQuestions: gameWaitBeforeQuestions(el),
		gameQuestion: gameQuestion(el),
		gameQuestionResults: gameQuestionResults(el),
		postgameResults: postgameResults(el),
		leaderboard: leaderboard(el),
		error: error(el)
	};
	router.init(routes, appConfig);
}

export default {
	init
};