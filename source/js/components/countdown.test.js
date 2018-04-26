import countdown from './countdown.js';

describe('countdown', () => {
    let countdownInst;

    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = '<div class="countdown-container"></div>';
        countdownInst = countdown();
    })

    afterEach(() => {
        setInterval.mockReset();
    })

    expect.extend({
        toBeEquivalent(received, argument) {
            const didPass = received.replace(/\s/g, '') === argument.replace(/\s/g, '');
            return {
                message: () => `expected ${received} to equal ${argument}`,
                pass: didPass
            }
        }
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

    it('should countdown each second', () => {
        countdownInst.start(1, 'seconds');
        expect(setInterval).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it('should initialize coundown', () => {
        countdownInst.start(1, 'seconds');
        expect(setInterval).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1000);
        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('should stop interval if called', () => {
        countdownInst.start(1, 'seconds');
        expect(setInterval).toHaveBeenCalledTimes(1);
        countdownInst.stop();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    })
})