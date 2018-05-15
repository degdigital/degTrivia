import {replaceContent} from '../utils/domUtils.js';

function renderChoiceResults(results, correctChoice) {
	const chosenPercentages = calculateChosenPercentages(results);
	return Object.keys(results).reduce((html, optId) => {
		const resultCssClasses = ['choice-result'];
		
		if(optId.toString() === correctChoice.toString()) {
			resultCssClasses.push('choice-result--is-correct');
		}

		const resultHtml = `
			<div class="${resultCssClasses.join(' ')}">
				<span>${results[optId].text}</span>
				<span>${chosenPercentages[optId]}</span>
			</div>
		`;
	
		return html + resultHtml;
	}, '');
}

function calculateChosenPercentages(results) {
	const resultsKeys = Object.keys(results);
	const total = resultsKeys.reduce((output, key) => output + results[key].chosenCount, 0);
	let output = {};
	resultsKeys.forEach(key => {
		output[key] = Math.round((results[key].chosenCount / total) * 100) + '%';
	});
	return output;
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