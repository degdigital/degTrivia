import {replaceContent} from '../utils/domUtils.js';

function renderChoiceResults(results, correctChoice, resultsPending) {
	let chosenPercentages;
	if (resultsPending !== true) {
		chosenPercentages = calculateChosenPercentages(results);
	}
	return Object.keys(results).reduce((html, optId) => {
		const resultCssClasses = ['choice-result'];
		
		if(optId.toString() === correctChoice.toString()) {
			resultCssClasses.push('choice-result--is-correct');
		}

		const resultHtml = `
			<div class="${resultCssClasses.join(' ')}">
				<span>${results[optId].text}</span>
				${chosenPercentages ? `<span>${chosenPercentages[optId]}</span>` : ``}
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
		if (results[key].chosenCount === 0) {
			output[key] = '0%';
		} else {
			output[key] = Math.round((results[key].chosenCount / total) * 100) + '%';
		}
	});
	return output;
}

function renderScreen(element, data) {
	const {questionData} = data;
	const resultsPending = data.resultsPending && data.resultsPending === true;

	const html = `
		<div>
			<h1>Question #${questionData.order + 1}</h1>			
			<p>${questionData.question}</p>
			${resultsPending === true ? '<p>Calculating results...</p>' : ''}
			<div class="choice-results">
				${renderChoiceResults(questionData.choices, questionData.correctChoice, resultsPending)}
			</div>
		</div>`;

	replaceContent(element, html);
}

export default function(element) {

	return {
		render: (data) => renderScreen(element, data)
	};
}