import fetchUtils from '../../utils/fetchUtils.js';

const autoQuestion = function() {

	const endpoint = 'https://opentdb.com/api.php?amount=1&type=multiple';

	function add() {
		return new Promise(async(resolve, reject) => {
			const rawQuestionObj = await getRawQuestionObj();
			if (!rawQuestionObj) {
				resolve(null);
			}
			const formattedQuestionObj = formatQuestionObj(rawQuestionObj);
			const confirmation = confirm(`Question:
${formattedQuestionObj.question}

Answers:${renderConfirmationAnswers(formattedQuestionObj)}`);
			if (confirmation === true) {
				resolve(formattedQuestionObj);
			} else {
				resolve(null);
			}
		});
	}

	async function getRawQuestionObj() {
		const response = await fetchUtils.getJSON(endpoint);
		if (!response) {
			return null;
		}
		return response.results[0];
	}

	function formatQuestionObj(rawQuestionObj) {
		const choices = rawQuestionObj.incorrect_answers.map(encodeSpecialChars);
		const correctAnswer = encodeSpecialChars(rawQuestionObj.correct_answer);
		const correctIndex = getRandomCorrectIndex(choices);
		choices.splice(correctIndex, 0, correctAnswer);
		return {
			choices,
			correctChoice: correctIndex,
			question: encodeSpecialChars(rawQuestionObj.question)
		}
	}

	function getRandomCorrectIndex(incorrectAnswers) {
		const answersCount = incorrectAnswers.length + 1;
		return Math.floor(Math.random() * (answersCount + 1));
	}

	function renderConfirmationAnswers(formattedQuestionObj) {
		return formattedQuestionObj.choices.reduce((output, choice, index) => `${output}
${choice}${formattedQuestionObj.correctChoice === index ? ' (correct)' : ''}`, '');
	}

	function encodeSpecialChars(str) {
		str = str.replace(/&quot;/g, `"`);
		str = str.replace(/&#039;/g, `'`);
		str = str.replace(/&amp;/g, `&`);
		return str;
	}

	return {
		add
	};

};

export default autoQuestion;