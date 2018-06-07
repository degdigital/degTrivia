import {replaceContent} from '../utils/domUtils.js';

const info = function(element) {


	function render({heading, message}) {
		replaceContent(element, `
			<div class="info-text">
				<h1 class="page-title page-title--centered">${heading}</h1>
				<p class="subheading text--centered">${message}</p>
			</div>
		`);
	}

	return {
		render
	};

};

export default info;