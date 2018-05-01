// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const resetApp = function(wrapperEl) {

	const db = dbService.getDb();
	const triggerClass = 'resetapp-trigger';

	function init() {
		bindEvents();
		render();
	}

	function bindEvents() {
		wrapperEl.addEventListener('click', onWrapperClick);
	}

	function onWrapperClick(e) {
		const el = e.target;
		if (el.classList.contains(triggerClass) && confirm('Are you sure?')) {
			updateVal(true)
				.then(() => updateVal(false))
				.catch(error => console.log(error));
		}
	}

	function updateVal(boolVal) {
		return db.ref().update({
			resetApp: boolVal
		});
	}

	function render(isDisabled) {
		replaceContent(wrapperEl, `
			<button class="${triggerClass}" id="resetApp" name="resetApp">Reset Application</button>
		`);
	}

	init();

};

export default resetApp;