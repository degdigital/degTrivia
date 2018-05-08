// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

const addSeries = function(wrapperEl, initialData) {

	const seriesRef = dbService.getDb().ref('series');

	const formClass = 'addseries-form';
	let formEl;

	function init() {
		bindEvents();
		render(initialData);
	}

	function bindEvents() {
		wrapperEl.addEventListener('submit', onSubmit);
	}

	function onSubmit(e) {
		e.preventDefault();
		const formVals = formMapper.getValues(formEl);
		saveFormData(formVals);
	}

	async function saveFormData(data) {
		const newKey = seriesRef.push().key;
		seriesRef.child(newKey).update({
			event: data.event,
			games: formatArrayToObject(data.games),
			name: data.name
		});
	}

	function render(data) {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
				<fieldset>
					<legend>Add a Series</legend>
					<div class="field">
						<label for="name">Name</label><br>
						<input id="name" name="name" type="text" required>
					</div>
					${renderDropdownSection('Event', data.events)}
					${renderCheckboxSection('Games', data.games)}
					<button type="submit">Submit</button>
				</fieldset>
			</form>
		`);
		formEl = wrapperEl.querySelector(`.${formClass}`);
	}

	function renderCheckboxSection(sectionName, sectionData) {
		if (!sectionData) {
			return '';
		}
		const lcName = sectionName.toLowerCase();
		const fields = Object.keys(sectionData).reduce((output, id, index) => `
			${output}
			<input id="addseries-${lcName}--${index}" name="${lcName}" type="checkbox" value="${id}">
			<label for="addseries-${lcName}--${index}">${sectionData[id].name}</label><br>
		`, `${sectionName}<br>`);
		return `
			<div class="field">
				${fields}
			</div>
		`;
	}

	function renderDropdownSection(sectionName, sectionData) {
		if (!sectionData) {
			return '';
		}
		const lcName = sectionName.toLowerCase();
		const options = Object.keys(sectionData).reduce((output, key) => `
			${output}
			<option value="${key}">${key}</option>
		`, '');
		return `
			<div class="field">
				<label for="${lcName}">${sectionName}</label><br>
				<select id="${lcName}" name="${lcName}" required>
					${options}
				</select>
			</div>
		`;
	}

	init();

};

export default addSeries;