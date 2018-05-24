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

// Components
import siteFrame from './components/siteFrame.js';

let siteFrameInst;

function init(appConfig) {
	firebase.initializeApp(firebaseConfig);
	dbService.init();
	playerService.init();

	siteFrameInst = render();
	
	routes.init(siteFrameInst.getMainEl(), appConfig);
	initGame();
}

function initGame() {	

	eventsService.subscribe('onActiveEventChanged', onActiveEventChanged);
	eventsService.subscribe('onPlayerUnauthenticated', () => router.route('registration'));
	eventsService.subscribe('onNoActiveEvent', infoObj => router.route('info', infoObj));
	eventsService.subscribe('onGameCountdown', (eventData) => router.route('pregameCountdown', eventData));
	eventsService.subscribe('onGameStart', gameData => router.route('gameWaitBeforeQuestions', gameData));
	eventsService.subscribe('onQuestionAsked', questionData => router.route('gameQuestion', questionData));
	eventsService.subscribe('onQuestionResults', questionData => router.route('gameQuestionResults', questionData));
	eventsService.subscribe('onPostgameResults', gameScore => router.route('postgameResults', gameScore));
	// TODO: figure out logic for showing pregameCountdown after game.
	// right now this was bypassing the postgameResults screen
	// eventsService.subscribe('onGameEnd', () => router.route('pregameCountdown'));
	eventsService.subscribe('onError', () => router.route('error'));
	eventsService.subscribe('onDatabaseReconnect', () => location.reload(true));
	eventsService.subscribe('onResetApp', () => location.reload(true));
	eventsService.init(); // Must be run after all eventsService.subscribe() calls
}

function render() {
	const rootEl = document.getElementById('app');
	return siteFrame(rootEl);
}

function onActiveEventChanged(eventData) {
	siteFrameInst.update({
		eventHashtag: eventData ? eventData.hashtag : null
	});	
}

function app(appConfig) {
	init(appConfig);
}

export default app;