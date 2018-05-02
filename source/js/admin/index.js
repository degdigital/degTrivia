import appConfig from '../config/appConfig.js';
import firebase from '@firebase/app';

// Services
import playerService from '../services/playerService.js';
import dbService from '../services/dbService.js';

// Screens
import login from './screens/login.js';
import manager from './screens/manager.js';

const admin = function(el) {

	let db;
	let loginInst;
	let managerInst;

	function bindEvents() {
		playerService.getAuth().onAuthStateChanged(onAuthStateChange);
	}

	async function onAuthStateChange(user) {
		if (user) {
			const isAdmin = await db.ref(`admins/${user.uid}`).once('value').then(snapshot => snapshot.exists() && snapshot.val() === true);
			if (isAdmin === true) {
				managerInst.render();
			} else {
				loginInst.renderForm();
			}
		} else {
			loginInst.renderForm();
		}
	}

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

		db = dbService.getDb();
		loginInst = login(el);
		managerInst = manager(el);

		bindEvents();
	}

	init();
};

if(appConfig.element) {
	admin(appConfig.element);
}