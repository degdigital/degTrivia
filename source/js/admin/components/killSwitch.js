// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const killSwitch = function(wrapperEl) {

	const db = dbService.getDb();
	const triggerClass = 'killswitch-trigger';

	function bindEvents() {
		db.ref('disableAll').once('value').then(snapshot => render(snapshot.val()));
		wrapperEl.addEventListener('click', onWrapperClick);
	}

	function onWrapperClick(e) {
		const el = e.target;
		if (el.classList.contains(triggerClass)) {
			if (el.checked === true) {
				if (confirm('Are you sure?')) {
					updateDb(true);
				} else {
					el.checked = false;
				}
			} else {
				updateDb(false);
			}
			
		}
	}

	function updateDb(boolVal) {
		db.ref().update({
			disableAll: boolVal
		});
	}

	function render(isDisabled) {
		replaceContent(wrapperEl, `
			<label for="disableAll">Disable Application</label>
			<input class="${triggerClass}" id="disableAll" name="disableAll" type="checkbox" ${isDisabled === true ? 'checked' : ''}>
		`);
	}

	bindEvents();
	
};

export default killSwitch;