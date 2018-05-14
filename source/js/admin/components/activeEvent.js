// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const activeEvent = function(wrapperEl, options ={}) {

	const db = dbService.getDb();
	const triggerClass = 'activeevent-trigger';
	const defaults = {
		onActiveEventChangeCallback: null
	};
	let settings = Object.assign({}, defaults, options);

	function bindEvents() {
		db.ref('events').once('value').then(snapshot => render(snapshot.val()));
		wrapperEl.addEventListener('change', onWrapperChange);
	}

	function onWrapperChange(e) {
		const el = e.target;
		if (el.classList.contains(triggerClass)) {
			const val = el.value === 'no-value' ? false : el.value;
			updateDb(val);
		}
	}

	function updateDb(val) {
		db.ref().update({
			activeEventId: val
		})
			.then(() => settings.onActiveEventChangeCallback(val));
	}

	async function render(events) {
		const activeEventId = await db.ref('activeEventId').once('value').then(snapshot => snapshot.val());
		settings.onActiveEventChangeCallback(activeEventId);
		replaceContent(wrapperEl, `
			<label for="activeEvent">Active Event:</label>
			<select class="${triggerClass}" id="activeEvent" name="activeEvent">
				${renderDropdownOptions(events, activeEventId)}
			</select>
		`);
	}

	function renderDropdownOptions(events, activeEventId) {
		return Object.keys(events).reduce((output, id) => {
			return `
				${output}
				<option value="${id}" ${activeEventId === id ? 'selected' : ''}>${events[id].name}</option>
			`;
		}, '<option value="no-value">No active event</option>');
	}

	bindEvents();
	
};

export default activeEvent;