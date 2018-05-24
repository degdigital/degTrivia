import MockDate from 'mockdate';

const submitAnswer = require('../components/submitAnswer');
const db = require('./__mocks__/db');
const functions = require('./__mocks__/firebase-functions');

describe('submitAnswer', () => {
    xit('should throw error if missing question id', () => {
        const data = {
            playerId: '1',
            choiceId: '1'
        };

        expect(submitAnswer(db, functions, data)).toThrow(HttpsError);
    });

    xit('should throw error if missing choice id', () => {
        const data = {
            questionId: '1',
            playerId: '1'
        };

        expect(submitAnswer(db, functions, data)).toThrow(HttpsError);
    });

    xit('should throw error if missing player id', () => {
        const data = {
            questionId: '1',
            choiceId: '1'
        };

        expect(submitAnswer(db, functions, data)).toThrow(HttpsError);
    });

    xit('should write submission time with player id', () => {
        const now = 338446800000;
        const data = {
            questionId: '1',
            choiceId: '1',
            playerId: '1'
        };
        const expectedOutput = {
            '1': now
        };
        
        MockDate.set(now);
        return submitAnswer(db, functions, data).then(resp => {
            expect(resp).toBeTruthy();
            expect(resp).toEqual(expectedOutput);
        })
    });
})