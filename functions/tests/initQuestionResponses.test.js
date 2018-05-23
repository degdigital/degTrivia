const initQuestionResponses = require('../components/initQuestionResponses');
const db = require('./__mocks__/db');

describe('updateMostRecentEventId', () => {
    let change = {};
    let context = {};

    beforeEach(() => {
        change = {
            after: {
                val: () => 'gameId1'
            }
        }

        context = {
            params: {
                eventId: 'eventId1'
            }
        }
    });

    afterEach(() => {
        db.clearGameVals();
    })

    xit('should init answers node with q data', () => {
        const expectedOutput = {
            questionId1: {
                eventId: 'eventId1',
                gameId: 'gameId1',
                correctChoiceId: 'optId1'
            }
        };

        db.__setGameVals({
            gameId1: {
                questions: {
                    questionId1: {
                        correctChoice: 'optId1'
                    }
                }
            }
        });

        return initQuestionResponses(db, change, context).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(1);
            expect(resp[0]).toEqual(expectedOutput);
        })
    })

    it('should handle if no game id', () => {
        change.after = {
            val: () => null
        }
        return initQuestionResponses(db, change, context).then(resp => {
            expect(resp).toBeFalsy();
            expect(resp).toBeUndefined();
        })
    })

    it('should handle game without questions', () => {
        db.__setGameVals({
            gameId1: {
                questionId1: {
                    questions: {}
                }
            }
        });

        return initQuestionResponses(db, change, context).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(0);
        })
    })

})