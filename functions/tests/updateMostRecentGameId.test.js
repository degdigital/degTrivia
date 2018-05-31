const updateMostRecentGameId = require('../components/updateMostRecentGameId');
const db = require('./__mocks__/db');

describe('updateMostRecentGameId', () => {
    it('should run if next val is valid', () => {
        const change = {
            before: { val: () => false },
            after: { val: () => '1' }
        };

        return updateMostRecentGameId(db, change).then(result => {
            expect(result).toBeTruthy();
            expect(result).toEqual({mostRecentGame: '1'})
        })
    })

    it('should do nothing if no next val', () => {
        const change = {
            before: { val: () => '1' },
            after: { val: () => false }
        };

        return updateMostRecentGameId(db, change).then(result => {
            expect(result).toBeFalsy();
            expect(result).toBeUndefined()
        })
    })
})