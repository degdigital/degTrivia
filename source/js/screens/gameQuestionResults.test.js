import gameQuestionResults from './gameQuestionResults';

let element;

const data = {
	questionData: {
		id: 10,
		order: 0,
		question: 'Who is the most dashing Kansas City Royal of all time?',
		choiceResults: [
			{
				choiceText: 'Bob Hamelin',
				isCorrectChoice: false,
				chosenCount: 28
			},
			{
				choiceText: 'Danny Tartabul',
				isCorrectChoice: false,
				chosenCount: 39
			},
			{
				choiceText: 'Steve Balboni',
				isCorrectChoice: true,
				chosenCount: 142
			}
		]
	}
};

beforeEach(() => {
	element = document.createElement('div');
	document.body.appendChild(element);
});

describe('calling render()', () => {
	test('renders out a question and choice results', async () => {
		await gameQuestionResults({element}).render(data);
		expect(element).toMatchSnapshot();
	});
});