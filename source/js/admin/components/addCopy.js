// Utils
import {replaceContent, emptyElements} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

const addCopy = function(wrapperEl, initialData) {

	const eventsRef = dbService.getDb().ref('events');
	const formClass = 'addcopy-form';
	const copyInputClass = 'addcopy-copyinput';
	const copyOutputWrapperClass = 'addcopy-output';
	const eventDropdownClass = 'event-dropdown';
	const deleteClass = 'addcopy-delete';
	let eventCopyRef;
	let formEl;
	let copyInputEl;
	let eventDropdownEl;
	let copyOutputWrapperEl;

	function init() {
		render(initialData);
		bindEvents();
		addEventRef(eventDropdownEl.value);
	}

	function bindEvents() {
		wrapperEl.addEventListener('submit', onSubmit);
		eventDropdownEl.addEventListener('change', e => addEventRef(e.target.value));
		wrapperEl.addEventListener('click', onClick);
	}

	function onClick(e) {
		const el = e.target;
		if (el.classList.contains(deleteClass) && eventCopyRef) {
			const copyId = el.dataset.copyId;
			eventCopyRef.update({
				[copyId]: null
			})
			copyInputEl.focus();
		}
	}

	async function onSubmit(e) {
		e.preventDefault();
		const formVals = formMapper.getValues(formEl);
		saveFormData(formVals);
	}

	function addEventRef(eventId) {
		if (eventCopyRef) {
			eventCopyRef.off();
		}
		eventCopyRef = eventsRef.child(`${eventId}/pregameRotatingCopy`);
		eventCopyRef.on('value', snapshot => renderCopyOutput(snapshot.val()));
	}

	async function saveFormData(formVals) {
		if (eventCopyRef) {
			const newKey = eventCopyRef.push().key;
			eventCopyRef.update({
				[newKey]: formVals.copy
			});
			copyInputEl.value = '';
		}
	}

	function render(data) {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
				<fieldset>
					<legend>Add Rotating Copy</legend>
					${renderDropdownSection(data.events)}
					<div class="field">
						<label class="is-hidden" for="copy">Name</label><br>
						<input class="${copyInputClass} input--wide" id="copy" name="copy" type="text" required>
						<button type="submit">Add</button>
					</div>
				</fieldset>
			</form>
			<div class="${copyOutputWrapperClass}"></div>
		`);
		formEl = wrapperEl.querySelector(`.${formClass}`);
		copyInputEl = formEl.querySelector(`.${copyInputClass}`);
		eventDropdownEl = wrapperEl.querySelector(`.${eventDropdownClass}`);
		copyOutputWrapperEl = wrapperEl.querySelector(`.${copyOutputWrapperClass}`);
	}

	function renderDropdownSection(sectionData) {
		if (!sectionData) {
			return '';
		}
		const options = Object.keys(sectionData).reduce((output, key) => `
			${output}
			<option value="${key}">${initialData.events[key].name}</option>
		`, '');
		return `
			<div class="field">
				<label for="eventId">Event</label><br>
				<select class="${eventDropdownClass}" name="eventId" required>
					${options}
				</select>
			</div>
		`;
	}

	function renderCopyOutput(copyObj) {
		emptyElements(copyOutputWrapperEl);
		if (!copyObj) {
			return;
		}
		const copyOutput = Object.keys(copyObj).reduce((output, key) => `
			${output}
			<li>${copyObj[key]} <button class="${deleteClass}" type="button" data-copy-id="${key}">Delete</button></li>
		`, '');
		copyOutputWrapperEl.insertAdjacentHTML('afterbegin', `
			<ul>
				${copyOutput}
			</ul>
		`);
	}

	init();

};

export default addCopy;