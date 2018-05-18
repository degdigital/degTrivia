// Config
import {getAppConfig} from '../config/appConfig.js';

// Firebase
import firebase from '@firebase/app';
import firebaseConfig from '../config/firebaseConfig.js';

// Services
import dbService from '../services/dbService.js';

// Screens
import manager from './screens/manager.js';

const leaderboardTV = function(el) {

	let db;
	let loginInst;

	function setUpListeners(managerInst) {
		dbService.getDb().ref(`leaderboardCurrent`).on('value', snapshot => managerInst.render(snapshot.val()));
	}

	function init() {
		firebase.initializeApp(firebaseConfig);
		dbService.init();

		db = dbService.getDb();
		const managerInst = manager(el);
		managerInst.render();
		
		setUpListeners(managerInst);
	}

	init();
};

const appConfig = getAppConfig();

if(appConfig.element) {
	leaderboardTV(appConfig.element);
}