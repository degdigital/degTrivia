import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import dbService from '../services/dbService.js';
import playerService from '../services/playerService.js';
import countdown from '../components/countdown.js';
import classnames from 'classnames';

const cssClasses = {
	choiceButtonDisabled: 'choice-button--disabled',
	choiceButtonSelected: 'choice-button--selected'
}

const dataAttrs = {
	countdown: 'data-countdown',
	choices: 'data-choices',
	choiceInput: 'data-choice-input'
};

function bindEventListeners(element, data) {
	const onChangeBound = e => onChange(e, element, data);

	element.addEventListener('change', onChangeBound);

	return onChangeBound;
}

function unbindEventListeners(element, onChangeBound) {
	if(onChangeBound) {
		element.removeEventListener('change', onChangeBound);
	}
}

function onChange(e, element, {questionData}) {
	if(e.target.hasAttribute(dataAttrs.choiceInput)) {
		const selectedChoiceId = e.target.value;
		const playerId = playerService.getAuth().currentUser.uid;
		dbService.submitAnswer(questionData.id, selectedChoiceId, playerId);
		updateChoices(element, questionData.choices, selectedChoiceId);
	}
}

function renderChoice(id, choice, isSelected, isDisabled) {
	const buttonClasses = classnames('button', 'choice-button', {
		'choice-button--disabled': isDisabled,
		'choice-button--selected': isSelected
	});

	return `
		<div class="choice-field">
			<input type="radio" id="choice-${id}" name="choice" value="${id}" class="is-vishidden" ${dataAttrs.choiceInput} ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} />
			<label for="choice-${id}" class="${buttonClasses}" ${isDisabled ? '' : 'tabindex="0"'}>${choice.text}</label>
		</div>
	`;
}

function renderChoices(choices, selectedChoiceId) {
	const choicesHtml = Object.keys(choices).reduce((html, id) => {
		const isSelected = id === selectedChoiceId;
		const isDisabled = selectedChoiceId ? true : false;
		
		return html + renderChoice(id, choices[id], isSelected, isDisabled); 
	}, '');

	return `<div class="choices" ${dataAttrs.choices}>${choicesHtml}</div>`;
}

function updateChoices(element, choices, selectedChoiceId) {
	const choicesEl = element.querySelector(`[${dataAttrs.choices}]`);
	replaceContent(choicesEl, renderChoices(choices, selectedChoiceId));
}

function renderScreen(element, data) {
	const {gameId, questionData} = data;

	const html = `
		<div class="question">
			<div class="countdown question__countdown" ${dataAttrs.countdown}></div>
			<h1 class="question__text">${questionData.question}</h1>
			${renderChoices(questionData.choices)}
		</div>`;

	replaceContent(element, html);
}

function onCountdownComplete(data) {
	data.resultsPending = true;
	router.route('gameQuestionResults', data);
}

function teardown(element, onChangeBound, countdownInst) {
	unbindEventListeners(element, onChangeBound);
	countdownInst.stop();
}

export default function(element) {
	let onChangeBound;
	let countdownInst;

	function render(data) {
		onChangeBound = bindEventListeners(element, data);
	
		const duration = data.questionData.expirationTime - Date.now();

		renderScreen(element, data);
		
		countdownInst = countdown({
			containerElement: element.querySelector(`[${dataAttrs.countdown}]`),
			format: 'mm:ss',
			onComplete: () => onCountdownComplete(data)
		});
		countdownInst.start(duration, 'milliseconds');
	}

	return {
		render,
		teardown: () => teardown(element, onChangeBound, countdownInst)
	};
}