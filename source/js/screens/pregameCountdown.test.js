import pregameCountdown from './pregameCountdown.js';
import dbService from '../services/dbService.js';
import countdown from '../components/countdown.js';
import MockDate from 'mockdate';

jest.mock('../services/dbService');
jest.mock('../components/countdown');

function createDateFromNow(minutesFromNow) {
    const dateFromNow = new Date();
    dateFromNow.setMinutes(dateFromNow.getMinutes() + minutesFromNow);
    return dateFromNow;
}

describe('pregameCountdown renders', () => {
    let element;

    let expectedCountdownOptions;

    beforeAll(() => {
        const now = 338446800000;
        MockDate.set(now);
    });

    beforeEach(() => {
        jest.clearAllMocks();

        document.body.innerHTML = '';
        element = document.createElement('div');
	    document.body.appendChild(element);

        dbService.__setNextGameTime(null);

        expectedCountdownOptions = {
            element, 
            precision: 'minute'
        };
    });

    it('no next game message if there is not a next game', async () => {
        await pregameCountdown(element).render();
        expect(element).toMatchSnapshot('no next game message');
    });

    it('countdown if next game starts exactly 15 minutes from now', async () => {
        const fifteenMinutesFromNow = createDateFromNow(15);

        dbService.__setNextGameTime(fifteenMinutesFromNow);

        const startSpy = jest.spyOn(countdown.__getInstance(), 'start');

        const expectedCountdownTime = fifteenMinutesFromNow.getTime() - Date.now();

        await pregameCountdown(element).render();
    
        expect(startSpy).toHaveBeenCalledTimes(1);
        expect(startSpy).toHaveBeenCalledWith(expectedCountdownTime, 'milliseconds');
        expect(element).toMatchSnapshot('countdown');
    });

    it('countdown if next game starts less than 15 minutes from now', async () => {
        const tenMinutesFromNow = createDateFromNow(10);

        dbService.__setNextGameTime(tenMinutesFromNow);

        const startSpy = jest.spyOn(countdown.__getInstance(), 'start');

        const expectedCountdownTime = tenMinutesFromNow.getTime() - Date.now();

        await pregameCountdown(element).render();
    
        expect(startSpy).toHaveBeenCalledTimes(1);
        expect(startSpy).toHaveBeenCalledWith(expectedCountdownTime, 'milliseconds');
        expect(element).toMatchSnapshot('countdown');
    });

    it('game time message if next game starts more than 15 minutes from now', async () => {
        const twentyMinutesFromNow = createDateFromNow(20);

        dbService.__setNextGameTime(twentyMinutesFromNow);

        const startSpy = jest.spyOn(countdown.__getInstance(), 'start');

        await pregameCountdown(element).render();
    
        expect(startSpy).not.toHaveBeenCalled();
        expect(element).toMatchSnapshot('game time message');
    });

    it('game ready message if next game start time has passed', async () => {
        const oneMinuteAgo = createDateFromNow(-1);

        dbService.__setNextGameTime(oneMinuteAgo);

        const startSpy = jest.spyOn(countdown.__getInstance(), 'start');

        await pregameCountdown(element).render();
    
        expect(startSpy).not.toHaveBeenCalled();
        expect(element).toMatchSnapshot('game ready message');
    });

    it('game ready message after countdown completes', async () => {
        const oneMinuteFromNow = createDateFromNow(1);

        dbService.__setNextGameTime(oneMinuteFromNow);
        
        await pregameCountdown(element).render();

        countdown.__complete();

        expect(element).toMatchSnapshot('game ready message');
    });
});