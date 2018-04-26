import gameQuestion from './gameQuestion';
import dbService from '../services/dbService';

jest.mock('../services/dbService');

let element;

const data = {
	gameId: 1,
	questionData: {
		id: 10,
		order: 0,
		question: 'Who is the most dashing Kansas City Royal of all time?',
		choices: {
			100: 'Bob Hamelin',
			101: 'Danny Tartabul',
			102: 'Steve Balboni' 
		}
	}
};

beforeEach(() => {
	element = document.createElement('div');
	document.body.appendChild(element);
});

describe('calling render()', () => {
	test('renders out a question and choices', async () => {
		await gameQuestion(element).render(data);
		expect(element).toMatchSnapshot();
	});
});

describe('selecting a choice', () => {
	test('calls the dbService submitAnswer() method', async () => {
		const submitAnswerSpy = jest.spyOn(dbService, 'submitAnswer');

		await gameQuestion(element).render(data);

		const firstChoiceButtonEl = element.querySelector('.choice-button');
		firstChoiceButtonEl.click();

		const expectedChoiceId = Object.keys(data.questionData.choices)[0];

		expect(submitAnswerSpy).toHaveBeenCalledTimes(1);
		expect(submitAnswerSpy.mock.calls[0]).toEqual([data.gameId, data.questionData.id, expectedChoiceId]);
	});

	test('disables the choice buttons', async () => {
		await gameQuestion(element).render(data);

		const firstChoiceButtonEl = element.querySelector('.choice-button');
		firstChoiceButtonEl.click();

		const choiceButtonsEls = [...element.querySelectorAll('.choice-button')];
		expect(choiceButtonsEls[0].disabled).toBe(true);
		expect(choiceButtonsEls[1].disabled).toBe(true);
		expect(choiceButtonsEls[2].disabled).toBe(true);
	});
});