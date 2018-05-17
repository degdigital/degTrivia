import {replaceContent} from '../utils/domUtils.js';
import router from '../utils/router.js';
import dbService from '../services/dbService.js';
import playerService from '../services/playerService.js';
import countdown from '../components/countdown.js';

const cssClasses = {
	countdownContainer: 'countdown-container',
	choices: 'choices',
	choiceButton: 'choice-button',
	choiceButtonSelected: 'choice-button--selected'
}

function bindEventListeners(element, data) {
	const onClickBound = e => onClick(e, element, data);

	element.addEventListener('click', onClickBound);

	return onClickBound;
}

function unbindEventListeners(element, onClickBound) {
	if(onClickBound) {
		element.removeEventListener('click', onClickBound);
	}
}

function onClick(e, element, {questionData}) {
	if(e.target.matches(`.${cssClasses.choiceButton}`)) {
		const selectedChoiceId = e.target.dataset.id;
		const playerId = playerService.getAuth().currentUser.uid;
		dbService.submitAnswer(questionData.id, selectedChoiceId, playerId);
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

		const buttonHtml = `<button class="${buttonClasses.join(' ')}" data-id="${key}" ${disabledAttr}>${choices[key].text}</button>\n`;

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
			<div class="countdown-container"></div>
			<p>${questionData.question}</p>
			<div class="${cssClasses.choices}">
				${renderChoices(questionData.choices)}
			</div>
		</div>`;

	replaceContent(element, html);
}

function onCountdownComplete(data) {
	data.resultsPending = true;
	router.route('gameQuestionResults', data);
}

function teardown(element, onClickBound, countdownInst) {
	unbindEventListeners(element, onClickBound);
	countdownInst.stop();
}

export default function({element}) {
	let onClickBound;
	let countdownInst;

	function render(data) {
		onClickBound = bindEventListeners(element, data);
	
		const duration = data.questionData.expirationTime - Date.now();

		renderScreen(element, data);
		
		countdownInst = countdown({
			containerElement: element.querySelector(`.${cssClasses.countdownContainer}`),
			format: 'mm:ss',
			onComplete: () => onCountdownComplete(data)
		});
		countdownInst.start(duration, 'milliseconds');
	}

	return {
		render,
		teardown: () => teardown(element, onClickBound, countdownInst)
	};
}