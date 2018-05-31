import countdown from './countdown.js';
import MockDate from 'mockdate';

describe('countdown', () => {
    let countdownInst;
    let onComplete;
    const now = 338446800000;

    beforeEach(() => {
        jest.useFakeTimers();

        MockDate.set(now);

        document.body.innerHTML = '<div class="countdown-container"></div>';
        
        onComplete = jest.fn();

        countdownInst = countdown({
            containerElement: document.querySelector('.countdown-container'),
            onComplete
        });
    })

    afterEach(() => {
        jest.clearAllTimers();
        setInterval.mockReset();
        clearInterval.mockReset();
    })

    it('should not run if container el is not found', () => {
        document.body.innerHTML = '';
        countdownInst = countdown();
        countdownInst.start(1, 'seconds');
        expect(setInterval).toHaveBeenCalledTimes(0);
    });

    it('should not run if number param is undefined', () => {
        countdownInst.start();
        expect(setInterval).toHaveBeenCalledTimes(0);
    });

    it('should render countdown', () => {
        countdownInst.start(1, 'seconds');
        
        MockDate.set(now + 1000);
        jest.advanceTimersByTime(1000);
        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('should start interval', () => {
        countdownInst.start(1, 'seconds');
        expect(setInterval).toHaveBeenCalledTimes(1);
    });

    it('should stop interval when completed', () => {
        countdownInst.start(1, 'seconds');
        MockDate.set(now + 1000);
        jest.advanceTimersByTime(1000);
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete callback when completed', () => {
        countdownInst.start(1, 'seconds');
        MockDate.set(now + 1000);
        jest.advanceTimersByTime(1000);
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should stop interval if called', () => {
        countdownInst.start(1, 'seconds');
        countdownInst.stop();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
})