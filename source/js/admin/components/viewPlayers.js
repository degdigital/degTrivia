// Utils
import {replaceContent} from '../../utils/domUtils';
import {renderObjKeysToList} from '../../utils/objectUtils';

// Services
import dbService from '../../services/dbService.js';

const viewPlayers = function(wrapperEl) {

	const db = dbService.getDb();
	const tableBodyClass = 'viewplayers-table-body';
	const dropdownClass = 'viewplayers-dropdown';
	const playerCountClass = 'playercount';
	let tableBodyEl = null;
	let dropdownEl = null;
	let playercountEl = null;
	let cachedPlayerData = {};
	let eventId = 'all-events';

	function init() {
		renderTable();
		tableBodyEl = wrapperEl.querySelector(`.${tableBodyClass}`);
		dropdownEl = wrapperEl.querySelector(`.${dropdownClass}`);
		bindEvents();
	}

	function bindEvents() {
		db.ref('events').on('value', snapshot => renderDropdownOptions(snapshot.val()));
		db.ref('players').on('value', snapshot => {
			cachedPlayerData = snapshot.val();
			const filteredPlayerData = filterPlayers(cachedPlayerData);
			renderTableRows(filteredPlayerData);
			renderPlayerCount(filteredPlayerData);
		});
		dropdownEl.addEventListener('change', onDropdownChange);
	}

	function onDropdownChange(e) {
		eventId = e.target.value;
		const filteredPlayerData = filterPlayers(cachedPlayerData);
		renderTableRows(filteredPlayerData);
		renderPlayerCount(filteredPlayerData);
	}

	function renderTable() {
		replaceContent(wrapperEl, `
			<select class="${dropdownClass}"></select><br><br>
			<table>
				<caption>Players<span class="${playerCountClass}"></span></caption>
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>ID</th>
						<th>Event</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody class="${tableBodyClass}"></tbody>
			</table>
		`);
		playercountEl = wrapperEl.querySelector(`.${playerCountClass}`);
	}

	function renderDropdownOptions(data) {
		const options = Object.keys(data).reduce((output, key) => `
			${output}
			<option value="${key}">${data[key].name}</option>
		`, '<option value="all-events">All Events</option>');
		replaceContent(dropdownEl, options);
	}

	function renderTableRows(data) {
		if (!data) {
			return;
		}
		const rows = data.reduce((output, row) => `
			${output}
			<tr>
				<td>${row.firstName}</td>
				<td>${row.lastName}</td>
				<td>${row.id}</td>
				<td>${row.event}</td>
				<td>${row.email}</td>
			</tr>
		`, '');
		replaceContent(tableBodyEl, rows);
	}

	function filterPlayers(playersData) {
		return Object.keys(playersData).reduce((output, key) => {
			const playerData = playersData[key];
			if (eventId === 'all-events' || playerData.event.toString() === eventId.toString()) {
				playerData.id = key;
				output.push(playerData);
			}
			return output;
		}, []);
	}

	function renderPlayerCount(data) {
		if (!data) {
			replaceContent(playercountEl, '');
		} else {
			replaceContent(playercountEl, ` (${data.length})`);
		}
		
	}

	init();

};

export default viewPlayers;