// Config
import appConfig from './config/appConfig.js';

// Utils
import router from './utils/router.js';

// Services
import dbService from './services/dbService.js';
import eventsService from './services/eventsService.js';
import playerService from './services/playerService.js';

// Screens
import registration from './screens/registration.js';
import pregameCountdown from './screens/pregameCountdown.js';
import gameWaitBeforeQuestions from './screens/gameWaitBeforeQuestions.js';
import gameQuestion from './screens/gameQuestion.js';
import gameQuestionResults from './screens/gameQuestionResults.js';
import postgameResults from './screens/postgameResults.js';
import leaderboard from './screens/leaderboardScreen.js';
import error from './screens/error.js';

// Firebase
import firebase from '@firebase/app';

if (appConfig.element) {

	const registrationInst = registration(appConfig);
	const pregameCountdownInst = pregameCountdown(appConfig);
	const gameWaitBeforeQuestionsInst = gameWaitBeforeQuestions(appConfig);
	const gameQuestionInst = gameQuestion(appConfig);
	const gameQuestionResultsInst = gameQuestionResults(appConfig);
	const postgameResultsInst = postgameResults(appConfig);
	const leaderboardInst = leaderboard(appConfig);
	const errorInst = error(appConfig);

	const routes = {
		registration: registrationInst.renderRegistrationForm,
		password: registrationInst.renderPasswordForm,
		pregameCountdown: pregameCountdownInst.render,
		gameWaitBeforeQuestions: gameWaitBeforeQuestionsInst.render,
		gameQuestion: gameQuestionInst.render,
		gameQuestionResults: gameQuestionResultsInst.render,
		postgameResults: postgameResults.render,
		leaderboard: leaderboardInst.render,
		error: errorInst.render
	};

	function init() {
		firebase.initializeApp({
			apiKey: "AIzaSyAZ5Ad3YFPCz2QKnMPtAl89tjplLQX6Lpw",
		    authDomain: "degtrivia-develop.firebaseapp.com",
		    databaseURL: "https://degtrivia-develop.firebaseio.com",
		    projectId: "degtrivia-develop",
		    storageBucket: "degtrivia-develop.appspot.com",
		    messagingSenderId: "369298224791"
		});
		dbService.init();
		playerService.init();
		router.init(routes, appConfig);
		
		eventsService.subscribe('onPlayerUnauthenticated', () => router.route('registration'));
		// eventsService.subscribe('onPlayerUnregisteredForEvent', () => router.route('password'));
		// eventsService.subscribe('onGameStart', gameData => router.route('gameWaitBeforeQuestions', gameData));
		// eventsService.subscribe('onGameEnd', () => router.route('pregameCountdown'));
		// eventsService.subscribe('onQuestionAsked', questionData => router.route('gameQuestion', questionData));
		// eventsService.subscribe('onBetweenQuestions', questionData => router.route('gameQuestionResults'));
		eventsService.subscribe('onErrorStateChanged', isError => {
			if (isError === true) {
				router.route('error');
			}
		});
		eventsService.init(); // Must be run after all eventsService.subscribe() calls
	}

	init();
}
