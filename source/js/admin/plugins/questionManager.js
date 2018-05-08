// Utils
import {replaceContent} from '../../utils/domUtils';

const questionManager = function(wrapperEl) {

	const formWrapperClass = 'form-wrapper';
	const formClass = 'question-form';
	const questionsWrapperClass = 'questions-wrapper';
	const formSubmitTriggerClass = 'form-submit-trigger';
	const formcancelTriggerClass = 'form-cancel-trigger';
	const hiddenClass = 'is-hidden';
	const addQuestionTriggerClass = 'add-question-trigger';
	const noQuestionsText = 'No questions found.';
	const questions = [];
	let questionsWrapperEl;
	let formWrapperEl;

	function init() {
		questionsWrapperEl = wrapperEl.querySelector(`.${questionsWrapperClass}`);
		renderForm();
		renderSummary();
		bindEvents();
	}

	function bindEvents() {
		wrapperEl.addEventListener('click', onWrapperClick);
		formWrapperEl.addEventListener('submit', onFormSubmit);
		formWrapperEl.addEventListener('click', onFormClick);
	}

	function onFormClick(e) {
		const el = e.target;
		if (el.matches(`.${formcancelTriggerClass}`)) {
			hideAddQuestionForm();
		}
	}

	function onFormSubmit(e) {
		const el = e.target;
		if (el.matches(`.${formClass}`)) {
			e.preventDefault();
		}
	}

	function onWrapperClick(e) {
		const el = e.target;
		if (el.matches(`.${addQuestionTriggerClass}`)) {
			showAddQuestionForm();
		}
	}

	function renderSummary(questions = null) {
		let summation;
		if (!questions) {
			summation = `<p>${noQuestionsText}</p>`
		}
		replaceContent(wrapperEl, `
			${summation}
			<button class="${addQuestionTriggerClass}" type="button">Add a Question</button>
		`)
	}

	function renderForm() {
		wrapperEl.insertAdjacentHTML('afterend', `
			<div class="${formWrapperClass} ${hiddenClass}">
				<form class="${formClass}">
					<legend>Add a Question</legend>
					<div class="field">
						<label for="question">Question text</question>
						<input id="question" name="question" type="text">
					</div>
					<button class="${formSubmitTriggerClass}" type="submit">Save</button>
					<button class="${formcancelTriggerClass}" type="cancel">Cancel</button>
				</form>
			</div>
		`);
		formWrapperEl = document.querySelector(`.${formWrapperClass}`);
	}

	function showAddQuestionForm() {
		wrapperEl.classList.add(hiddenClass);
		formWrapperEl.classList.remove(hiddenClass);
	}

	function hideAddQuestionForm() {
		wrapperEl.classList.remove(hiddenClass);
		formWrapperEl.classList.add(hiddenClass);
	}

	init();

};

export default questionManager;