const initActiveQuestionCountdown = require('../components/initActiveQuestionCountdown');
const db = require('./__mocks__/db');

describe('initActiveQuestionCountdown', () => {
    let change = {};
    let context = {};

    beforeEach(() => {
        change = {
            after: {
                val: () => 'gameId1',
                ref: {
                    parent: {
                        update: val => val
                    }
                }
            }
        }
        jest.useFakeTimers();
        jest.setTimeout(500);
    })

    it('should handle empty question id', () => {
        change.after = {
            val: () => false
        }

        return initActiveQuestionCountdown(db, change).then(resp => {
            expect(resp).toBeFalsy();
            expect(resp).toBeUndefined();
        });
    });

    it('should update activeQuestionId to false', () => {
        const expectedOutput = {
            activeQuestionId: false
        }
        const promise = initActiveQuestionCountdown(db, change);
        console.log('invoked method');
        jest.advanceTimersByTime(500);
        return promise.then(resp => {
            expect(resp).toHaveLength(2);
            expect(resp[0]).toEqual(expectedOutput);
        });
    });

    xit('should handle no questions duration', () => {

    });

    xit('should update question counts', () => {

    });

    xit('should update showQuestionResults flag', () => {

    });

   
});