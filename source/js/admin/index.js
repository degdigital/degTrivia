// Firebase
import firebase from '@firebase/app';
import firebaseConfig from '../config/firebaseConfig.js';

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
		firebase.initializeApp(firebaseConfig);
		dbService.init();
		playerService.init();

		db = dbService.getDb();
		loginInst = login(el);
		managerInst = manager(el);

		bindEvents();
	}

	init();
};

const rootEl = document.getElementById('app');
admin(rootEl);