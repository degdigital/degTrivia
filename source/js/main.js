import appConfig from './config/appConfig.js';
import router from './utils/router.js';
import dbService from './services/dbService.js';
import eventsService from './services/eventsService.js';
import playerService from './services/playerService.js';
import registration from './screens/registration.js';
import gameLanding from './screens/gameLanding.js';
import gameWait from './screens/gameWait.js';
import firebase from '@firebase/app';

if (appConfig.element) {
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
	eventsService.init();


	const registrationInst = registration(appConfig);
	const gameLandingInst = gameLanding(appConfig);
	const gameWaitInst = gameWait(appConfig);
	const routes = {
		registration: registrationInst.renderRegistrationForm,
		password: registrationInst.renderPasswordForm,
		gameLanding: gameLandingInst.render,
		gameWait: gameWaitInst.render
	};
	router.init(routes, appConfig);

	playerService.authorize()
		.then(() => router.route('gameWait'))
		.catch(errors => {
			if (errors.mustReauthenticate === true) {
				router.route('password');
			} else {
				router.route('registration');
			}
		});
}
