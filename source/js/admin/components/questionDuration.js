// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

const questionDuration = function(wrapperEl) {

	const db = dbService.getDb();
	const formClass = 'questionduration-form';
	const inputClass = 'questionduration-input';
	let formEl;
	let inputEl;

	function init() {
		render();
		formEl = wrapperEl.querySelector(`.${formClass}`);
		inputEl = wrapperEl.querySelector(`.${inputClass}`);
		bindEvents();
	}

	function bindEvents() {
		db.ref('questionDuration').on('value', snapshot => inputEl.value = snapshot.val());
		formEl.addEventListener('submit', onSubmit);
	}

	function onSubmit(e) {
		e.preventDefault();
		const formVals = formMapper.getValues(formEl);
		updateDb(formVals);
	}

	function updateDb(formVals) {
		db.ref().update({
			questionDuration: parseInt(formVals.questionDuration)
		});
	}

	function render() {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
			<label for="questionDuration">Question Duration (milliseconds)</label><br>
			<input class="${inputClass}" id="questionDuration" name="questionDuration" type="text">
			<button type="submit">Submit</button>
		`);
	}

	init();
	
};

export default questionDuration;