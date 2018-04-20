import {replaceContent} from '../utils/domUtils.js';

const registration = function(config) {

	function init() {

	}

	function render() {
		replaceContent(element, `
			Registration
		`);
	}

	init();

	return {
		render
	};

};

export default registration;