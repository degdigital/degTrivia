// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

const addEvent = function(wrapperEl, initialData) {

	const eventsRef = dbService.getDb().ref('events');

	const formClass = 'addevent-form';
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
		const entryExists = await eventsRef.orderByChild('alias').equalTo(data.alias).once('value').then(snapshot => snapshot.exists());
		if (entryExists) {
			alert('Event already exists.');
		} else {
			const newKey = eventsRef.push().key;
			eventsRef.child(newKey).update({
				activeGameId: false,
				alias: data.alias,
				gameIsInProgress: false,
				games: formatArrayToObject(data.games),
				name: data.name,
				series: formatArrayToObject(data.series)
			});
		}
	}

	function formatArrayToObject(arr = null) {
		if (!arr) {
			return null;
		}
		let output = {};
		arr.map(item => output[item] = true);
		return output;
	}

	function render(data) {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
				<fieldset>
					<legend>Add an Event</legend>
					<div class="field">
						<label for="name">Name</label><br>
						<input id="name" name="name" type="text" required>
					</div>
					<div class="field">
						<label for="alias">Alias</label><br>
						<input id="alias" name="alias" type="text" required>
					</div>
					${renderCheckboxSection('Series', data.series)}
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
			<input id="${lcName}--${index}" name="${lcName}" type="checkbox" value="${id}">
			<label for="${lcName}--${index}">${sectionData[id].name}</label><br>
		`, `${sectionName}<br>`);
		return `
			<div class="field">
				${fields}
			</div>
		`;
	}

	init();

};

export default addEvent;