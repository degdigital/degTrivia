// Utils
import router from './utils/router.js';
import {getUrlSegment} from './utils/urlUtils';
import routes from './routes.js';

// Services
import dbService from './services/dbService.js';
import eventsService from './services/eventsService.js';
import playerService from './services/playerService.js';

// Firebase
import firebase from '@firebase/app';

function init(appConfig) {
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
	
	initGame(appConfig);
}

function initGame(appConfig) {
	routes.init(appConfig);

	eventsService.subscribe('onPlayerUnauthenticated', () => router.route('registration'));
	eventsService.subscribe('onNoActiveEvent', infoObj => router.route('info', infoObj));
	eventsService.subscribe('onGameCountdown', () => router.route('pregameCountdown'));
	eventsService.subscribe('onGameStart', gameData => router.route('gameWaitBeforeQuestions', gameData));
	eventsService.subscribe('onQuestionAsked', questionData => router.route('gameQuestion', questionData));
	eventsService.subscribe('onBetweenQuestions', questionData => router.route('gameQuestionResults', questionData));
	eventsService.subscribe('onPostgameResults', () => router.route('postgameResults'));
	eventsService.subscribe('onGameEnd', () => router.route('pregameCountdown'));
	eventsService.subscribe('onError', () => router.route('error'));
	// eventsService.subscribe('onErrorResolved', infoObj => router.route('info', infoObj));
	eventsService.subscribe('onResetApp', () => location.reload());
	eventsService.init(); // Must be run after all eventsService.subscribe() calls
}

function app(appConfig) {
	if (appConfig.element) {
		init(appConfig);
	}
}

export default app;