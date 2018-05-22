// Utils
import router from './utils/router.js';
import {getUrlSegment} from './utils/urlUtils';
import routes from './routes.js';
import {replaceContent} from './utils/domUtils.js';

// Services
import dbService from './services/dbService.js';
import eventsService from './services/eventsService.js';
import playerService from './services/playerService.js';

// Firebase
import firebase from '@firebase/app';
import firebaseConfig from './config/firebaseConfig.js';

// Components
import siteHeader from './components/siteHeader.js';

function init(appConfig) {
	firebase.initializeApp(firebaseConfig);
	dbService.init();
	playerService.init();

	const mainEl = render();
	
	routes.init(mainEl, appConfig);
	initGame();
}

function initGame() {	

	eventsService.subscribe('onPlayerUnauthenticated', () => router.route('registration'));
	eventsService.subscribe('onNoActiveEvent', infoObj => router.route('info', infoObj));
	eventsService.subscribe('onGameCountdown', () => router.route('pregameCountdown'));
	eventsService.subscribe('onGameStart', gameData => router.route('gameWaitBeforeQuestions', gameData));
	eventsService.subscribe('onQuestionAsked', questionData => router.route('gameQuestion', questionData));
	eventsService.subscribe('onQuestionResults', questionData => router.route('gameQuestionResults', questionData));
	eventsService.subscribe('onPostgameResults', gameScore => router.route('postgameResults', gameScore));
	// TODO: figure out logic for showing pregameCountdown after game.
	// right now this was bypassing the postgameResults screen
	// eventsService.subscribe('onGameEnd', () => router.route('pregameCountdown'));
	eventsService.subscribe('onError', () => router.route('error'));
	// eventsService.subscribe('onErrorResolved', infoObj => router.route('info', infoObj));
	eventsService.subscribe('onResetApp', () => location.reload());
	eventsService.init(); // Must be run after all eventsService.subscribe() calls
}

function render() {
	const rootEl = document.getElementById('app');

	const html = `
		${siteHeader({gameHashtag: '#CNXTRIVIA', showGameHashtag: true})}
		<main class="main page-width" data-main></main>
	`;

	replaceContent(rootEl, html);

	return rootEl.querySelector('[data-main]');
}

function app(appConfig) {
	init(appConfig);
}

export default app;