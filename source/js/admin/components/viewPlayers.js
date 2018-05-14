// Utils
import {replaceContent} from '../../utils/domUtils';
import {renderObjKeysToList} from '../../utils/objectUtils';

// Services
import dbService from '../../services/dbService.js';

const viewPlayers = function(wrapperEl) {

	const db = dbService.getDb();
	const tableBodyClass = 'viewplayers-table-body';
	const dropdownClass = 'viewplayers-dropdown';
	let tableBodyEl = null;
	let dropdownEl = null;
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
			renderTableRows(cachedPlayerData);
		});
		dropdownEl.addEventListener('change', onDropdownChange);
	}

	function onDropdownChange(e) {
		eventId = e.target.value;
		renderTableRows(cachedPlayerData);
	}

	function renderTable() {
		replaceContent(wrapperEl, `
			<select class="${dropdownClass}"></select><br><br>
			<table>
				<caption>Players</caption>
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
	}

	function renderDropdownOptions(data) {
		const options = Object.keys(data).reduce((output, key) => `
			${output}
			<option value="${key}">${data[key].name}</option>
		`, '<option value="all-events">All Events</option>');
		replaceContent(dropdownEl, options);
	}

	function renderTableRows(data) {
		const rows = Object.keys(data).reduce((output, key) => {
			if (eventId === 'all-events' || data[key].event.toString() === eventId.toString()) {
				return `
					${output}
					<tr>
						<td>${data[key].firstName}</td>
						<td>${data[key].lastName}</td>
						<td>${key}</td>
						<td>${data[key].event}</td>
						<td>${data[key].email}</td>
					</tr>
				`;
			} else {
				return output;
			}
		}, '');
		replaceContent(tableBodyEl, rows);
	}

	init();

};

export default viewPlayers;