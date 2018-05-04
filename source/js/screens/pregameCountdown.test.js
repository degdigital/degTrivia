import pregameCountdown from './pregameCountdown';
import dbService from '../services/dbService';

jest.mock('../services/dbService', () => {
    return {
        getNextGameTime: jest
            .fn()
            .mockResolvedValue(null)
            .mockResolvedValueOnce(new Date('May 5, 2020 12:00:00'))
    }
});

describe('pregameCountdown', () => {
    let element;

    beforeEach(() => {
        document.body.innerHTML = '';
        element = document.createElement('div');
	    document.body.appendChild(element);
    });

    it('renders', async () => {
        await pregameCountdown({element}).render();
        expect(element).toBeTruthy();

        const countdownContainer = element.querySelector('.countdown-container');
        expect(countdownContainer).toBeTruthy();

        const nextTimeEl = element.querySelector('.next-game-time');
        expect(nextTimeEl).toBeTruthy();
    })

    it('renders nothing if no next game', async () => {
        await pregameCountdown({element}).render();
        expect(document.body.innerHTML).toEqual(`<div></div>`
        );
    });

});