import leaderboard from './leaderboard.js';

jest.mock('../services/dbService');

let element;

describe('leaderboard', () => {

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);
	})

    it('should render', async () => {
		await leaderboard().renderToElement(element);
		expect(element).toMatchSnapshot();
    });
});