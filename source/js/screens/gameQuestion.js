import {replaceContent} from '../utils/domUtils.js';
import dbService from '../services/dbService.js';

const cssClasses = {
	choices: 'choices',
	choiceButton: 'choice-button',
	choiceButtonSelected: 'choice-button--selected'
}

function bindEventListeners(element, data, onClickBound) {
	onClickBound = e => onClick(e, element, data);

	element.addEventListener('click', onClickBound);
}

function unbindEventListeners(element, onClickBound) {
	if(onClickBound) {
		element.removeEventListener('click', onClickBound);
	}
}

function onClick(e, element, {gameId, questionData}) {
	if(e.target.matches(`.${cssClasses.choiceButton}`)) {
		const selectedChoiceId = e.target.dataset.id;
		dbService.submitAnswer(gameId, questionData.id, selectedChoiceId);
		updateChoices(element, questionData.choices, selectedChoiceId);
	}
}

function renderChoices(choices, selectedChoiceId) {
	return Object.keys(choices).reduce((html, key) => {
		const isSelected = key === selectedChoiceId;
		const buttonClasses = [cssClasses.choiceButton];
		const disabledAttr = selectedChoiceId ? 'disabled' : '';
		
		if(isSelected) {
			buttonClasses.push(cssClasses.choiceButtonSelected);
		} 

		const buttonHtml = `<button class="${buttonClasses.join(' ')}" data-id="${key}" ${disabledAttr}>${choices[key]}</button>\n`;

		return html + buttonHtml;
	}, '');
}

function updateChoices(element, choices, selectedChoiceId) {
	const choicesEl = element.querySelector(`.${cssClasses.choices}`);
	replaceContent(choicesEl, renderChoices(choices, selectedChoiceId));
}

function renderScreen(element, data) {
	const {gameId, questionData} = data;

	const html = `
		<div>
			<h1>Question #${questionData.order + 1}</h1>
			<div>0:00</div>
			<p>${questionData.question}</p>
			<div class="${cssClasses.choices}">
				${renderChoices(questionData.choices)}
			</div>
		</div>`;

	replaceContent(element, html);
}

function teardown(element, onClickBound) {
	unbindEventListeners(element, onClickBound);
}

export default function({element}) {

	let onClickBound;

	function render(data) {
		onClickBound = bindEventListeners(element, data);
		renderScreen(element, data);
	}

	return {
		render,
		teardown: () => teardown(element, onClickBound)
	};
}