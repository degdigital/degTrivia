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
			const eventId = el.value === 'no-value' ? false : parseInt(el.value);
			updateDb(eventId)
				.then(() => settings.onActiveGameChangeCallback(eventId));
		}
	}

	function updateDb(eventId) {
		if (!activeEventId) {
			return Promise.resolve();
		}
		return db.ref(`events/${activeEventId}`).update({
			activeGameId: eventId === false ? false : eventId,
			gameIsInProgress: eventId !== false
		});
	}

	async function render(eventId) {
		const dbUpdate = await updateDb(eventId);
		activeEventId = eventId;
		const responses = await Promise.all([
			db.ref(`events/${activeEventId}/activeGameId`).once('value').then(snapshot => snapshot.val()),
			db.ref('games').orderByChild('event').equalTo(activeEventId).once('value').then(snapshot => snapshot.val())
		]);
		const activeGameId = responses[0];
		const games = responses[1];
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