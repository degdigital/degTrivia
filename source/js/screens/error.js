import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';

const error = function(element) {


	function render(isError = false) {
		replaceContent(element, `
		<div class="info-text">
			<h1 class="page-title page-title--centered">Oops</h1>
			<p class="subheading text--centered">We're experiencing some technical difficulties. Stay with us. The page will refresh when ready.</p>
		</div>
		`);
	}

	return {
		render
	};

};

export default error;