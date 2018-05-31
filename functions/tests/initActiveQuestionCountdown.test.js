const initActiveQuestionCountdown = require('../components/initActiveQuestionCountdown');
const db = require('./__mocks__/db');

describe('initActiveQuestionCountdown', () => {
    const updateChild = {
        update: val => val
    };
    let change = {};
    let context = {};

    beforeEach(() => {
        change = {
            after: {
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
                responses: {
                    optId1: {
                        playerId1: 1527005651093
                    },
                    optId2: {
                        playerId2: 1527005651093
                    }
                }
            }
        })
    })

    function getChangeInst() {
        return change;
    }

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
        return initActiveQuestionCountdown(db, change).then(resp => {
            expect(resp).toHaveLength(2);
            expect(resp[0]).toEqual(expectedOutput);
        });
    });

    it('should update question counts', () => {
        const ref = change.after.ref.parent.child();
        const writeSpy = jest.spyOn(ref, 'update');
        const expectedWriteObj = {chosenCount: 1};

        return initActiveQuestionCountdown(db, change).then(resp => {
            expect(resp).toHaveLength(2);
            expect(writeSpy).toHaveBeenCalledTimes(2);
            expect(writeSpy).toHaveBeenCalledWith(expectedWriteObj);
        });
    });

    it('should handle no responses recorded', () => {
        db.__setAnswerVals({
            questionId1: {}
        })

        return initActiveQuestionCountdown(db, change).then(resp => {
            expect(resp).toHaveLength(2);
        });
    })

    it('should update showQuestionResults flag', () => {
        const expectedOutput = {
            showQuestionResults: 'questionId1'
        }
        return initActiveQuestionCountdown(db, change).then(resp => {
            expect(resp).toHaveLength(2);
            expect(resp[1]).toEqual(expectedOutput);
        });
    });
});