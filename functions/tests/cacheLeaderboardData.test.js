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
        db.__setGameResultVals({
            playerId1: {
                indexVal: '2||05000',
                score: 2,
                timeElapsed: 5000,
                timeRemaining: 5000
            },
            playerId2: {
                indexVal: '3||05000',
                score: 3,
                timeElapsed: 5000,
                timeRemaining: 5000
            },
            playerId3: {
                indexVal: '1||05000',
                score: 1,
                timeElapsed: 5000,
                timeRemaining: 5000
            }
        });

        db.__setPlayers({
            playerId1: { firstName: 'Player', lastName: '1' }, 
            playerId2: { firstName: 'Player', lastName: '2' },
            playerId3: { firstName: 'Player', lastName: '3' }
        })
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

    it('should save leaderboard data', () => {
        const expectedOutput = {
            showGameOver: false,
            showGameResults: true
        };

        const expectedLeaderboard = [ 
            { name: 'Player 2.', score: 3, timeElapsed: 5000 },
            { name: 'Player 1.', score: 2, timeElapsed: 5000 },
            { name: 'Player 3.', score: 1, timeElapsed: 5000 } 
        ];

        return cacheLeaderboardData(db, change).then(resp => {
            expect(resp).toEqual(expectedOutput);
            expect(db.getLeaderboard()).toEqual(expectedLeaderboard);
        })
    })

    it('should save leaderboard sorted by score', () => {
        const expectedOutput = {
            showGameOver: false,
            showGameResults: true
        };

        const expectedLeaderboard = [ 
            { name: 'Player 2.', score: 3, timeElapsed: 5000 },
            { name: 'Player 1.', score: 2, timeElapsed: 5000 },
            { name: 'Player 3.', score: 1, timeElapsed: 5000 } 
        ];

        return cacheLeaderboardData(db, change).then(resp => {
            expect(resp).toEqual(expectedOutput);
            expect(db.getLeaderboard()).toEqual(expectedLeaderboard);
        })
    })

    it('should save leaderboard sorted by score then time', () => {
        const expectedOutput = {
            showGameOver: false,
            showGameResults: true
        };

        const expectedLeaderboard = [ 
            { name: 'Player 2.', score: 2, timeElapsed: 5000 },
            { name: 'Player 1.', score: 2, timeElapsed: 7000 },
            { name: 'Player 3.', score: 1, timeElapsed: 5000 } 
        ];

        db.__setGameResultVals({
            playerId1: {
                indexVal: '2||03000',
                score: 2,
                timeElapsed: 7000,
                timeRemaining: 3000
            },
            playerId2: {
                indexVal: '2||05000',
                score: 2,
                timeElapsed: 5000,
                timeRemaining: 5000
            },
            playerId3: {
                indexVal: '1||05000',
                score: 1,
                timeElapsed: 5000,
                timeRemaining: 5000
            }
        });

        return cacheLeaderboardData(db, change).then(resp => {
            expect(resp).toEqual(expectedOutput);
            expect(db.getLeaderboard()).toEqual(expectedLeaderboard);
        })
    })
})