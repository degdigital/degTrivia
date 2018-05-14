import gameQuestion from './gameQuestion.js';
import dbService from '../services/dbService.js';
import playerService from '../services/playerService.js';
import countdown from '../components/countdown.js';

jest.mock('../services/dbService');
jest.mock('../services/playerService');
jest.mock('../components/countdown');

let element;

const data = {
	gameId: 1,
	questionData: {
		id: 10,
		order: 0,
		question: 'Who is the most dashing Kansas City Royal of all time?',
		duration: 30000,
		choices: {
			100: {
				text: 'Bob Hamelin',
				chosenCount: 0
			},
			101: {
				text: 'Danny Tartabul',
				chosenCount: 0
			},
			102: {
				text: 'Steve Balboni',
				chosenCount: 0
			}
		}
	}
};

beforeEach(() => {
	jest.clearAllMocks();
	element = document.createElement('div');
	document.body.appendChild(element);
});

describe('calling render()', () => {
	test('renders out a question and choices', async () => {
		gameQuestion({element}).render(data);
		expect(element).toMatchSnapshot();
	});

	test('starts the countdown', async () => {
		const countdownInst = countdown.__getInstance();

		const expectedOptions = {
			containerElement: expect.any(Object),
			format: 'mm:ss'
		};	

		const startSpy = jest.spyOn(countdownInst, 'start');

		const gameQuestionInst = gameQuestion({element});
	 	gameQuestionInst.render(data);
		gameQuestionInst.teardown(); 

		expect(countdown).toHaveBeenCalledTimes(1);
		expect(countdown).toHaveBeenCalledWith(expectedOptions);
		expect(startSpy).toHaveBeenCalledTimes(1);
		expect(startSpy).toHaveBeenCalledWith(data.questionData.duration, 'milliseconds');
	});
});

describe('selecting a choice', () => {
	test('calls the dbService submitAnswer() method', () => {
		const submitAnswerSpy = jest.spyOn(dbService, 'submitAnswer');

		gameQuestion({element}).render(data);

		const firstChoiceButtonEl = element.querySelector('.choice-button');
		firstChoiceButtonEl.click();

		const expectedChoiceId = Object.keys(data.questionData.choices)[0];

		expect(submitAnswerSpy).toHaveBeenCalledTimes(1);
		expect(submitAnswerSpy).toHaveBeenCalledWith(data.questionData.id, expectedChoiceId, playerService.__authData.currentUser.uid);
	});

	test('disables the choice buttons', () => {
		gameQuestion({element}).render(data);

		const firstChoiceButtonEl = element.querySelector('.choice-button');
		firstChoiceButtonEl.click();

		const choiceButtonsEls = [...element.querySelectorAll('.choice-button')];
		expect(choiceButtonsEls[0].disabled).toBe(true);
		expect(choiceButtonsEls[1].disabled).toBe(true);
		expect(choiceButtonsEls[2].disabled).toBe(true);
	});
});

describe('calling teardown()', () => {
	test('stops the countdown', () => {
		const countdownInst = countdown.__getInstance();

		const stopSpy = jest.spyOn(countdownInst, 'stop');

		const gameQuestionInst = gameQuestion({element});
		gameQuestionInst.render(data);
		gameQuestionInst.teardown(); 

		expect(stopSpy).toHaveBeenCalledTimes(1);
	});

});