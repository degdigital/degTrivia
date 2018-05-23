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
    })

    it('should init answers node with q data', () => {
        const expectedOutput = {
            questionId1: {
                eventId: 'eventId1',
                gameId: 'gameId1',
                correctChoiceId: 'optId1'
            }
        };

        return initQuestionResponses(db, change, context).then(resp => {
            expect(resp).toBeTruthy();
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
        change.after = {
            val: () => 'noQuestions'
        }

        return initQuestionResponses(db, change, context).then(resp => {
            expect(resp).toBeTruthy();
            expect(resp).toHaveLength(0);
        })
    })

})