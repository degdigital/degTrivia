// Firebase
import firebase from '@firebase/app';
import firebaseConfig from '../config/firebaseConfig.js';

// Services
import dbService from '../services/dbService.js';
import playerService from '../services/playerService.js';

// Screens
import login from '../admin/screens/login.js';
import leaderboardScreen from './screens/leaderboardScreen.js';
import marketingScreen from './screens/marketingMessage.js';

const leaderboardTV = function(el) {

	let db;
	let loginInst;
	let managerInst;

	function setUpListeners(managerInst) {
		playerService.getAuth().onAuthStateChanged(onAuthStateChange);
	}

	async function onAuthStateChange(user) {
		if (user) {
			const isAdmin = await db.ref(`admins/${user.uid}`).once('value').then(snapshot => snapshot.exists() && snapshot.val() === true);
			if (isAdmin === true) {
				dbService.getDb().ref(`leaderboardCurrent`).on('value', snapshot => managerInst.render(snapshot.val()));
			} else {
				loginInst.renderForm();
			}
		} else {
			loginInst.renderForm();
		}
	}

	function init() {
		firebase.initializeApp(firebaseConfig);
		dbService.init();
		playerService.init();

		db = dbService.getDb();
		loginInst = login(el);
		managerInst = leaderboardScreen(el);
		
		setUpListeners(managerInst);
	}

	init();
};

const rootEl = document.querySelector('.main');
leaderboardTV(rootEl);
