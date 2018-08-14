import fetchUtils from '../../utils/fetchUtils';
import {generateKey} from './gameService';

export function getGeneratedQuestion() {
	return new Promise(async(resolve, reject) => {
		const rawQuestionObj = await fetchQuestion();
		if (!rawQuestionObj) {
			resolve(null);
		}

        resolve(formatQuestionObj(rawQuestionObj));
	});
}

async function fetchQuestion() {
    const response = await fetchUtils.getJSON('https://opentdb.com/api.php?amount=1&type=multiple');
    if (!response) {
        return null;
    }
    return response.results[0];
}

function formatQuestionObj(rawQuestionObj) {
    const choices = [...rawQuestionObj.incorrect_answers];
    const correctIndex = getRandomCorrectIndex(choices);
    choices.splice(correctIndex, 0, rawQuestionObj.correct_answer);

    const formattedChoices = choices.map(choice => {
        return {
            chosenCount: 0,
            text: encodeSpecialChars(choice),
            id: generateKey()
        }
    })    

    return {
        choices: formattedChoices,
        correctChoice: formattedChoices[correctIndex].id,
        question: encodeSpecialChars(rawQuestionObj.question)
    }
}

function encodeSpecialChars(str) {
    str = str.replace(/&quot;/g, `"`);
    str = str.replace(/&#039;/g, `'`);
    str = str.replace(/&amp;/g, `&`);
    return str;
}

function getRandomCorrectIndex(incorrectAnswers) {
    return Math.floor(Math.random() * (incorrectAnswers.length + 1));
}