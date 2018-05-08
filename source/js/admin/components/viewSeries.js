// Utils
import {replaceContent} from '../../utils/domUtils';
import {renderObjKeysToList} from '../../utils/objectUtils';

// Services
import dbService from '../../services/dbService.js';

const viewSeries = function(wrapperEl) {

	const db = dbService.getDb();
	const tableBodyClass = 'viewseries-table-body';
	let tableBodyEl = null;

	function init() {
		renderTable();
		tableBodyEl = wrapperEl.querySelector(`.${tableBodyClass}`);
		bindEvents();
	}

	function bindEvents() {
		db.ref('series').on('value', snapshot => renderTableRows(snapshot.val()));
	}

	function renderTable() {
		replaceContent(wrapperEl, `
			<table>
				<caption>All Series</caption>
				<thead>
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th>Event</th>
						<th>Games</th>
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
				<td>${key}</td>
				<td>${data[key].event}</td>
				<td>${renderObjKeysToList(data[key].games)}</td>
			</tr>
		`, '');
		replaceContent(tableBodyEl, rows);
	}

	init();

};

export default viewSeries;