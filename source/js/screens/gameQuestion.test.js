import gameQuestion from './gameQuestion.js';
import dbService from '../services/dbService.js';
import playerService from '../services/playerService.js';
import countdown from '../components/countdown.js';
import MockDate from 'mockdate';

jest.mock('../services/dbService');
jest.mock('../services/playerService');
jest.mock('../components/countdown');

let element;

const now = 338446800000;

const data = {
	gameId: 1,
	questionData: {
		id: 10,
		order: 0,
		question: 'Who is the most dashing Kansas City Royal of all time?',
		expirationTime: 338446815000,
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

	MockDate.set(now);

	element = document.createElement('div');
	document.body.appendChild(element);
});

describe('calling render()', () => {
	test('renders out a question and choices', async () => {
		gameQuestion(element).render(data);
		expect(element).toMatchSnapshot();
	});

	test('starts the countdown', async () => {
		const countdownInst = countdown.__getInstance();

		const expectedOptions = {
			containerElement: expect.any(Object),
			format: 'mm:ss',
			onComplete: expect.any(Function)
		};	

		const startSpy = jest.spyOn(countdownInst, 'start');

		const gameQuestionInst = gameQuestion(element);
	 	gameQuestionInst.render(data);
		gameQuestionInst.teardown(); 

		const expectedDuration = data.questionData.expirationTime - now;

		expect(countdown).toHaveBeenCalledTimes(1);
		expect(countdown).toHaveBeenCalledWith(expectedOptions);
		expect(startSpy).toHaveBeenCalledTimes(1);
		expect(startSpy).toHaveBeenCalledWith(expectedDuration, 'milliseconds');
	});
});

describe('selecting a choice', () => {
	test('calls the dbService submitAnswer() method', () => {
		const submitAnswerSpy = jest.spyOn(dbService, 'submitAnswer');

		gameQuestion(element).render(data);

		const firstChoiceInputEl = element.querySelector('[data-choice-input]');
		firstChoiceInputEl.click();

		const expectedChoiceId = Object.keys(data.questionData.choices)[0];

		expect(submitAnswerSpy).toHaveBeenCalledTimes(1);
		expect(submitAnswerSpy).toHaveBeenCalledWith(data.questionData.id, expectedChoiceId, playerService.__authData.currentUser.uid);
	});

	test('disables the choice buttons', () => {
		gameQuestion(element).render(data);

		const firstChoiceInputEl = element.querySelector('[data-choice-input]');
		firstChoiceInputEl.click();

		const choiceInputEls = [...element.querySelectorAll('[data-choice-input]')];
		expect(choiceInputEls[0].disabled).toBe(true);
		expect(choiceInputEls[1].disabled).toBe(true);
		expect(choiceInputEls[2].disabled).toBe(true);
	});
});

describe('calling teardown()', () => {
	test('stops the countdown', () => {
		const countdownInst = countdown.__getInstance();

		const stopSpy = jest.spyOn(countdownInst, 'stop');

		const gameQuestionInst = gameQuestion(element);
		gameQuestionInst.render(data);
		gameQuestionInst.teardown(); 

		expect(stopSpy).toHaveBeenCalledTimes(1);
	});

});