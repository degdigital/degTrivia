// Utils
import {emptyElements, replaceContent, removeElements} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Plugins
import autoQuestion from './autoQuestion.js';

const questionManager = function(wrapperEl, options = {}) {

	const formWrapperClass = 'form-wrapper';
	const formClass = 'question-form';
	const questionsWrapperClass = 'questions-wrapper';
	const formSubmitTriggerClass = 'form-submit-trigger';
	const formcancelTriggerClass = 'form-cancel-trigger';
	const hiddenClass = 'is-hidden';
	const addQuestionTriggerClass = 'add-question-trigger';
	const addQuestionAutoTriggerClass = 'add-question-auto-trigger';
	const choicesClass = 'choices';
	const choiceClass = 'choice';
	const addChoiceClass = 'add-choice';
	const removeChoiceClass = 'remove-choice';
	const correctChoiceInputClass = 'correct-choice-input';
	const noQuestionsText = 'No questions found.';
	const questionsVals = [];
	const defaults = {
		onSaveCallback: null
	};
	const autoQuestionInst = autoQuestion();
	let settings;
	let questionsWrapperEl;
	let formWrapperEl;
	let choicesEl;
	let choicesCount = 0;

	function init() {
		settings = Object.assign({}, defaults, options);
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
		if (el.matches(`.${formcancelTriggerClass}`) && confirm('Are you sure?')) {
			hideAddQuestionForm();
		}
		if (el.matches(`.${addChoiceClass}`)) {
			addChoice();
		}
		if (el.matches(`.${removeChoiceClass}`)) {
			removeChoice();
		}
	}

	function onFormSubmit(e) {
		const el = e.target;
		if (el.matches(`.${formClass}`)) {
			e.preventDefault();
			const formVals = formMapper.getValues(formWrapperEl);
			const formattedQuestionVals = formatQuestionVals(formVals);
			handleQuestionAdd(formattedQuestionVals);
		}
	}

	function onWrapperClick(e) {
		const el = e.target;
		if (el.matches(`.${addQuestionTriggerClass}`)) {
			addChoice(true);
			showAddQuestionForm();
		}
		if (el.matches(`.${addQuestionAutoTriggerClass}`)) {
			addAutoQuestion();
		}
	}

	function renderSummary(questions = null) {
		let summation;
		if (!questions) {
			summation = `<p>${noQuestionsText}</p>`
		} else {
			const questionsSummary = questions.reduce((output, item) => `
				${output}
				${item.question}<br>
			`, '');
			summation = `
				<ol>
					${questionsSummary}
				</ol>
			`;
		}
		replaceContent(questionsWrapperEl, `
			${summation}
			<button class="${addQuestionTriggerClass}" type="button">Manually Add a Question</button>
			<button class="${addQuestionAutoTriggerClass}" type="button">Automatically Generate a Question</button>
		`)
	}

	function renderForm() {
		wrapperEl.insertAdjacentHTML('afterend', `
			<div class="${formWrapperClass} ${hiddenClass}">
				<form class="${formClass}">
					<legend>Add a Question</legend>
					<div class="field">
						<label for="question">Question text</label><br>
						<input class="input--wide" id="question" name="question" type="text" required>
					</div>
					Choices / Correct Answer
					<button class="${addChoiceClass}" type="button">Add</button>
					<button class="${removeChoiceClass}" type="button">Remove</button><br>
					<div class="${choicesClass}"></div>
					<button class="${formSubmitTriggerClass}" type="submit">Add Question</button>
					<button class="${formcancelTriggerClass}" type="button">Cancel</button>
				</form>
			</div>
		`);
		formWrapperEl = document.querySelector(`.${formWrapperClass}`);
		choicesEl = formWrapperEl.querySelector(`.${choicesClass}`);
	}

	function addChoice(clearChoices = false) {
		if (clearChoices === true) {
			choicesCount = 0;
			emptyElements(choicesEl);
		}
		choicesEl.insertAdjacentHTML('beforeend', `
			<div class="${choiceClass} choice-${choicesCount}">
				<div class="field">
					<label class="is-hidden" for="choice-${choicesCount}">Choice ${choicesCount}</label>
					<input class="input--medium" id="choice-input-${choicesCount}" name="choice-input-${choicesCount}" type="text" required>
				</div>
				<div class="field">
					<label class="is-hidden" for="correct-input-${choicesCount}">Correct Choice 1</label>
					<input class="${correctChoiceInputClass}" id="correct-input-${choicesCount}" name="correctChoice" type="radio" value="${choicesCount}"${clearChoices === true ? ' checked' : ''}>
				</div>
			</div>
		`);
		choicesCount++;
	}

	function removeChoice() {
		if (choicesCount > 1) {
			const lastIndex = choicesCount - 1;
			const lastChoiceEl = choicesEl.querySelector(`.choice-${lastIndex}`);
			if (lastChoiceEl.querySelector(`#correct-input-${lastIndex}`).checked === true) {
				choicesEl.querySelector(`.${correctChoiceInputClass}`).checked = true;
			}
			removeElements(lastChoiceEl);
			choicesCount--;
		}
	}

	function handleQuestionAdd(questionVals) {
		questionsVals.push(questionVals);
		renderSummary(questionsVals);
		hideAddQuestionForm();
		if (settings.onSaveCallback !== null) {
			settings.onSaveCallback(questionVals);
		}
	}

	function showAddQuestionForm() {
		wrapperEl.classList.add(hiddenClass);
		Array.from(formWrapperEl.querySelectorAll('input')).forEach(el => el.removeAttribute('disabled'));
		formWrapperEl.classList.remove(hiddenClass);
	}

	function hideAddQuestionForm() {
		Array.from(formWrapperEl.querySelectorAll('input')).forEach(el => {
			el.value = '';
			el.setAttribute('disabled', true)
		});
		wrapperEl.classList.remove(hiddenClass);
		formWrapperEl.classList.add(hiddenClass);
	}

	function formatQuestionVals(formVals) {
		const formattedVals = Object.keys(formVals).reduce((output, key) => {
			if (key.includes('choice-input-')) {
				output.choices = output.choices || [];
				output.choices.push(formVals[key]);
			} else {
				output[key] = formVals[key];
			}
			return output;
		}, {});
		return formattedVals;
	}

	async function addAutoQuestion() {
		const questionData = await autoQuestionInst.add();
		if (questionData) {
			handleQuestionAdd(questionData);
		}
	}

	function getQuestionVals() {
		return questionsVals;
	}

	init();

	return {
		getQuestionVals
	};

};

export default questionManager;