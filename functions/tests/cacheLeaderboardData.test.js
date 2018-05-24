const cacheLeaderboardData = require('../components/cacheLeaderboardData');
const db = require('./__mocks__/db');

describe('cacheLeaderboardData', () => {
    let change;

    beforeEach(() => {
        change = {
            after: {
                val: () => true,
                ref: {
                    parent: {
                        update: newVal => newVal
                    }
                }
            }
        }
    })

    it('should resolve if next val is false', () => {
        change.after = {
            val: () => false
        }

        return cacheLeaderboardData(db, change).then(resp => {
            expect(resp).toBeUndefined();
        })
    })

    it('should resolve if no results data', () => {
        db.__setGameResultVals(null);
        const expectedOutput = {
            showGameOver: false,
            showGameResults: true
        };

        return cacheLeaderboardData(db, change).then(resp => {
            expect(resp).toEqual(expectedOutput);
        })
    })

})