// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import playerService from '../../services/playerService.js';
import dbService from '../../services/dbService.js';

// Screens
import killSwitch from '../components/killSwitch.js';

const manager = function(el) {

	const auth = playerService.getAuth();
	const db = dbService.getDb();
	const killSwitchInst = killSwitch();
	
	function bindEvents() {
		db.ref().on('value', snapshot => onValChange(snapshot));
	}

	function render() {
		replaceContent(el, `
			<h1>Welcome, admin!</h1>
			${killSwitchInst.render()}
		`);
		bindEvents();
	}

	function onValChange(val) {
		console.log(val);
	}

	return {
		render
	};

};

export default manager;