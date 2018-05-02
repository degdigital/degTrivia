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

function init(appConfig) {

	const routes = {
		info: info(appConfig),
		registration: registration(appConfig),
		pregameCountdown: pregameCountdown(appConfig),
		gameWaitBeforeQuestions: gameWaitBeforeQuestions(appConfig),
		gameQuestion: gameQuestion(appConfig),
		gameQuestionResults: gameQuestionResults(appConfig),
		postgameResults: postgameResults(appConfig),
		leaderboard: leaderboard(appConfig),
		error: error(appConfig)
	};
	router.init(routes, appConfig);
}

export default {
	init
};