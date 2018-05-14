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
import firebaseConfig from './config/firebaseConfig.js';

function init(appConfig) {
	firebase.initializeApp(firebaseConfig);
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
	eventsService.subscribe('onPostgameResults', gameScore => router.route('postgameResults', gameScore));
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