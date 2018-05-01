// Services
import playerService from '../services/playerService.js';
import dbService from '../services/dbService.js';

// Screens
import login from './login.js';
import manager from './manager.js';

const admin = function(el) {

	const auth = playerService.getAuth();
	const db = dbService.getDb();
	const loginInst = login(el);
	const managerInst = manager(el);

	function bindEvents() {
		auth.onAuthStateChanged(onAuthStateChange);
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
		bindEvents();
	}

	init();

};

export default admin;