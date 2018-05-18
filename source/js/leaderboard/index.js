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
	// let managerInst;

	function init() {
		firebase.initializeApp(firebaseConfig);
		dbService.init();

		db = dbService.getDb();
        // managerInst = manager(el);
        manager(el).render();
	}

	init();
};

const appConfig = getAppConfig();

if(appConfig.element) {
	leaderboardTV(appConfig.element);
}