import {replaceContent} from '../utils/domUtils.js';
import classnames from 'classnames';

function renderPendingResult(result) {
	return `
		<div class="choice-result">
			<span class="choice-result__text">${result.text}</span>
		</div>
	`;
}

function renderResult(result) {
	const resultCssClasses = classnames('choice-result', {
		'choice-result--correct': result.isCorrectChoice,
		'choice-result--incorrect': result.isIncorrectUserChoice
	});

	const animationDuration = result.fraction * 2; //fraction of 2 seconds

	return `
		<div class="${resultCssClasses}">
			<div class="choice-result__meter" style="transform: scaleX(${result.fraction}); animation-duration: ${animationDuration}s;"></div>
			<span class="choice-result__text">${result.text}</span>
			<span class="choice-result__total">${formatPercentage(result.fraction)}</span>
		</div>
	`;
}

function renderChoiceResults(results) {
	return results.reduce((html, result) => {
		const resultHtml = result.isPending ? 
			renderPendingResult(result) :
			renderResult(result);
	
		return html + resultHtml;
	}, '');
}

function formatPercentage(val) {
	return Math.round(val * 100) + '%';
}

function getTotalResponses(choices) {
	return Object.keys(choices).reduce((total, key) => 
		total + choices[key].chosenCount
	, 0);
}

function buildPendingResults(choices) {
	return Object.keys(choices).map(choiceId => (
		{
			id: choiceId,
			text: choices[choiceId].text,
			isPending: true	
		}));
}

function buildResults(choices, correctChoice, userChoiceId) {
	const totalResponses = getTotalResponses(choices);

	return Object.keys(choices).map(choiceId => {
		const choice = choices[choiceId];
		const isCorrectChoice = choiceId === correctChoice;
		const isIncorrectUserChoice = (choiceId === userChoiceId) && !isCorrectChoice;
		const fraction = totalResponses > 0 ? choice.chosenCount / totalResponses : 0;

		return {
			id: choiceId,
			text: choice.text,
			fraction,
			isCorrectChoice,
			isIncorrectUserChoice
		};
	});
}

function renderStatus(isUserChoiceCorrect) {
	const cssClasses = classnames('question-status', {
		'question-status--correct': isUserChoiceCorrect,
		'question-status--incorrect': !isUserChoiceCorrect
	});

	return `<div class="${cssClasses}">${isUserChoiceCorrect ? 'Correct' : 'Incorrect'}</div>`;	
}

function renderScreen(element, data) {
	const {questionData, userChoiceId} = data;
	const resultsPending = data.resultsPending && data.resultsPending === true;
	const isUserChoiceCorrect = userChoiceId === questionData.correctChoice;

	const results = resultsPending ?
		buildPendingResults(questionData.choices) :
		buildResults(questionData.choices, questionData.correctChoice, userChoiceId);

	const html = `
		<div class="question">
			<header class="question-header">
				${resultsPending === true ? '<p class="question-status question-status--calculating">Calculating results...</p>' : renderStatus(isUserChoiceCorrect)}
				<h1 class="question__text">${questionData.question}</h1>
			</header>	
			<div class="choice-results">
				${renderChoiceResults(results)}
			</div>
		</div>`;

	replaceContent(element, html);
}

export default function(element) {

	return {
		render: (data) => renderScreen(element, data)
	};
}