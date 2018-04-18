import {replaceContent} from '../utils/domUtils.js';
import dbService from '../services/dbService.js';

const gameLanding = function({element, eventAlias}) {

	function init() {

	}

	function render({user}) {
		console.log(user);
		if (user) {
			renderLoggedIn(user);
		} else {
			renderLoggedOut();
		}
	}

	function renderLoggedIn(user) {
		replaceContent(element, `
			Logged in -- event alias ${eventAlias}
		`);
	}

	function renderLoggedOut() {
		replaceContent(element, `
			Logged out -- event alias ${eventAlias}
		`);
	}

	init();

	return {
		render
	};

};

export default gameLanding;