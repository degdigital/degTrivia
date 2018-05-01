// Utils
import {replaceContent} from '../utils/domUtils';

// Services
import playerService from '../services/playerService.js';
import dbService from '../services/dbService.js';

const manager = function(el) {

	const auth = playerService.getAuth();
	const db = dbService.getDb();

	function render() {
		replaceContent(el, `
			Welcome, admin!
		`);
	}

	return {
		render
	};

};

export default manager;