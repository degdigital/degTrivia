const updateGameResults = require('../components/updateGameResults');
const db = require('./__mocks__/db');

describe('updateGameResults', () => {
    let change;

    beforeEach(() => {
        change = {
            before: {
                val: () => 'questionId1',
                ref: {
                    parent: {
                        child: () => updateChild,
                        update: val => val
                    }
                }
            }
        }
        db.__setAnswerVals({
            questionId1: {
                correctChoiceId: 'optId1',
                startTime: 1542726000000,
                endTime: 1542726010000,
                event: 'eventId1',
                gameId: 'gameId1',
                responses: {
                    optId1: {
                        playerId1: 1542726005000
                    },
                    optId2: {
                        playerId2: 1542726007000
                    }
                }
            }
        })

        db.__setGameResultVals({
            indexVal: '0001||00005000',
            score: 1,
            timeElapsed: 8000,
            timeRemaining: 5000
        })
    })

    it('should handle no questionId', () => {
        change.before.val = () => false;

        return updateGameResults(db, change).then(resp => {
            expect(resp).toBeUndefined();
        })
    })

    it('should handle a question without responses', () => {
        db.__setAnswerVals({
            questionId1: {}
        })

        return updateGameResults(db, change).then(resp => {
            expect(resp).toBeUndefined();
        })
    })

    it('should handle if responses, but no right answers', () => {
        db.__setAnswerVals({
            questionId1: {
                correctChoiceId: 'optId2',
                responses: {
                    optId1: {
                        playerId1: 1527005651093
                    }
                }
            }
        })

        return updateGameResults(db, change).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(0);
        })
    })

    it('should put in score if player not currently in list', () => {
        const newScoreVal = { 
            score: 1,
            timeElapsed: 5000,
            timeRemaining: 5000,
            indexVal: '0001||00005000' 
        };
        const expectedOutput = [newScoreVal, newScoreVal];
        db.__setGameResultVals(null);

        return updateGameResults(db, change).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(1); // number of players with correct answer
            expect(resp[0]).toEqual(expectedOutput); // vals for new score stored in game Results
            // one for event and one for game
        })
    })

    it('should add to score if player in list', () => {
        const newScoreVal = { 
            score: 2,
            timeElapsed: 13000,
            timeRemaining: 10000,
            indexVal: '0002||00010000' 
        };
        const expectedOutput = [newScoreVal, newScoreVal];

        return updateGameResults(db, change).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(1); // number of players with correct answer
            expect(resp[0]).toEqual(expectedOutput); // vals for new score stored in game Results
            // one for event and one for game
        })
    })

    it('pads indexVal', () => {
        const newScoreVal = { 
            score: 2,
            timeElapsed: 13000,
            timeRemaining: 7000,
            indexVal: '0002||00007000' 
        };
        const expectedOutput = [newScoreVal, newScoreVal];
        db.__setGameResultVals({
            indexVal: '0001||00002000',
            score: 1,
            timeElapsed: 8000,
            timeRemaining: 2000
        })

        return updateGameResults(db, change).then(resp => {
            expect(Array.isArray(resp)).toBe(true);
            expect(resp).toHaveLength(1); // number of players with correct answer
            expect(resp[0]).toEqual(expectedOutput); // vals for new score stored in game Results
            // one for event and one for game
        })
    })
});