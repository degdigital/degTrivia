import gameQuestionResults from './gameQuestionResults';

let element;

const data = {
	questionData: {
		id: 10,
		order: 0,
		question: 'Who is the most dashing Kansas City Royal of all time?',
		correctChoice: 102,
		choices: {
			100: {
				text: 'Bob Hamelin',
				chosenCount: 28
			},
			101: {
				text: 'Danny Tartabul',
				chosenCount: 39
			},
			102: {
				text: 'Steve Balboni',
				chosenCount: 142
			}
		}
	}
};

beforeEach(() => {
	element = document.createElement('div');
	document.body.appendChild(element);
});

describe('calling render()', () => {
	test('renders out a question and choice results', async () => {
		await gameQuestionResults(element).render(data);
		expect(element).toMatchSnapshot();
	});
});