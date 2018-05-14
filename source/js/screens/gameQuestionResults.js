import {replaceContent} from '../utils/domUtils.js';

function renderChoiceResults(results, correctChoice) {
	return Object.keys(results).reduce((html, optId) => {
		const resultCssClasses = ['choice-result'];
		
		if(optId.toString() === correctChoice.toString()) {
			resultCssClasses.push('choice-result--is-correct');
		}

		const resultHtml = `
			<div class="${resultCssClasses.join(' ')}">
				<span>${results[optId].text}</span>
				<span>${results[optId].chosenCount}</span>
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
				${renderChoiceResults(questionData.choices, questionData.correctChoice)}
			</div>
		</div>`;

	replaceContent(element, html);
}

export default function({element}) {

	return {
		render: (data) => renderScreen(element, data)
	};
}