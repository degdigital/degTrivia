// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const viewGames = function(wrapperEl) {

	const db = dbService.getDb();
	const tableBodyClass = 'viewseries-table-body';
	let tableBodyEl = null;

	function init() {
		renderTable();
		tableBodyEl = wrapperEl.querySelector(`.${tableBodyClass}`);
		bindEvents();
	}

	function bindEvents() {
		db.ref('games').on('value', snapshot => renderTableRows(snapshot.val()));
	}

	function renderTable() {
		replaceContent(wrapperEl, `
			<table>
				<caption>All Games</caption>
				<thead>
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th>Event</th>
						<th>Series</th>
						<th>Active Question ID</th>
						<th>Questions</th>
						<th>Start Time</th>
						<th>Game Results Showing</th>
						<th>Question Results Showing</th>
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
				<td>${data[key].series}</td>
				<td>${data[key].activeQuestionId ? data[key].activeQuestionId : 'None'}</td>
				<td>${renderObjKeysToList(data[key].questions)}</td>
				<td>${data[key].startTime}</td>
				<td>${data[key].showGameResults ? 'Yes' : 'No'}</td>
				<td>${data[key].showQuestionResults ? 'Yes' : 'No'}</td>
			</tr>
		`, '');
		replaceContent(tableBodyEl, rows);
	}

	function renderObjKeysToList(obj) {
		if (!obj) {
			return '';
		}
		const listItems = Object.keys(obj).reduce((output, key) => `
			${output}
			<li>${key}</li>
		`, '');
		return `
			<ul>
				${listItems}
			</ul>
		`;
	}

	init();

};

export default viewGames;