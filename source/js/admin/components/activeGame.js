// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const activeGame = function(wrapperEl, options ={}) {

	const db = dbService.getDb();
	const triggerClass = 'activegame-trigger';
	const defaults = {
		onActiveGameChangeCallback: null
	};
	let settings = Object.assign({}, defaults, options);
	let activeEventId;

	function bindEvents() {
		wrapperEl.addEventListener('change', onWrapperChange);
	}

	function onWrapperChange(e) {
		const el = e.target;
		if (el.classList.contains(triggerClass)) {
			const val = el.value === 'no-value' ? false : parseInt(el.value);
			updateDb(val);
		}
	}

	function updateDb(val) {
		db.ref(`events/${activeEventId}`).update({
			activeGameId: val
		})
			.then(() => settings.onActiveGameChangeCallback(val));
	}

	async function render(eventId) {
		if (activeEventId && !eventId) {
			db.ref(`events/${activeEventId}`).update({
				activeGameId: false
			});
		}
		activeEventId = eventId;
		const activeGameId = await db.ref(`events/${activeEventId}/activeGameId`).once('value').then(snapshot => snapshot.val());
		const games = await db.ref('games').orderByChild('event').equalTo(activeEventId).once('value').then(snapshot => snapshot.val());
		let content = '';
		if (games) {
			content = `
				<label for="activeGame">Active Game:</label>
				<select class="${triggerClass}" id="activeGame" name="activeGame">
					${renderDropdownOptions(games, activeGameId)}
				</select>
			`;
		}
		settings.onActiveGameChangeCallback(activeGameId);
		replaceContent(wrapperEl, content);
	}

	function renderDropdownOptions(games, activeGameId) {
		return Object.keys(games).reduce((output, id) => {
			return `
				${output}
				<option value="${id}" ${activeGameId === parseInt(id) ? 'selected' : ''}>${games[id].name}</option>
			`;
		}, '<option value="no-value">No active game</option>');
	}

	bindEvents();

	return {
		render
	};
	
};

export default activeGame;