import {replaceContent} from '../utils/domUtils.js';

function renderChoiceResults(results) {
	return results.reduce((html, result) => {
		const resultCssClasses = ['choice-result'];

		if(result.isCorrectChoice) {
			resultCssClasses.push('choice-result--is-correct');
		}

		const resultHtml = `
			<div class="${resultCssClasses.join(' ')}">
				<span>${result.choiceText}</span>
				<span>${result.chosenCount}</span>
			</div>
		`;
	
		return html + resultHtml;
	}, '');
}

function renderScreen(element, data) {
	const {questionData} = data;

	const html = `
		<div>
			<h1>Question #${questionData.order + 1}</h1>			
			<p>${questionData.question}</p>
			<div class="choice-results">
				${renderChoiceResults(questionData.choiceResults)}
			</div>
		</div>`;

	replaceContent(element, html);
}

export default function({element}) {

	return {
		render: (data) => renderScreen(element, data)
	};
}