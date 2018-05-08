// Utils
import {replaceContent} from '../../utils/domUtils';
import {renderObjKeysToList} from '../../utils/objectUtils';

// Services
import dbService from '../../services/dbService.js';

const viewEvents = function(wrapperEl) {

	const db = dbService.getDb();
	const tableBodyClass = 'viewevents-table-body';
	let tableBodyEl = null;

	function init() {
		renderTable();
		tableBodyEl = wrapperEl.querySelector(`.${tableBodyClass}`);
		bindEvents();
	}

	function bindEvents() {
		db.ref('events').on('value', snapshot => renderTableRows(snapshot.val()));
	}

	function renderTable() {
		replaceContent(wrapperEl, `
			<table>
				<caption>All Events</caption>
				<thead>
					<tr>
						<th>Name</th>
						<th>Alias</th>
						<th>ID</th>
						<th>Series</th>
						<th>Games</th>
						<th>Active Game</th>
						<th>In Progress</th>
					</tr>
				</thead>
				<tbody class="${tableBodyClass}"></tbody>
			</table>
		`);
	}

	function renderTableRows(data) {
		const rows = Object.keys(data).reduce((output, key) => `
			${output}
			<tr>
				<td>${data[key].name}</td>
				<td>${data[key].alias}</td>
				<td>${key}</td>
				<td>${renderObjKeysToList(data[key].series)}</td>
				<td>${renderObjKeysToList(data[key].games)}</td>
				<td>${data[key].activeGameId ? data[key].activeGameId : 'None'}</td>
				<td>${data[key].gameIsInProgress ? 'Yes' : 'No'}</td>
			</tr>
		`, '');
		replaceContent(tableBodyEl, rows);
	}

	init();

};

export default viewEvents;