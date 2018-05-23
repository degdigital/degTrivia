'use strict';

const db = {};

function wrapDBVal(retData) {
    return {
        once: () => Promise.resolve({
            val: () => retData
        })
    }
}

function getGameVals(includeQuestions) {
    const questions = {
        questionId1: {
            correctChoice: 'optId1'
        }
    };

    const retVal = includeQuestions ? {questions} : {};

    return wrapDBVal(retVal);
}

function ref(path) {
    switch (path) {
        case 'games/gameId1':
            return getGameVals(true);
        case 'games/noQuestions':
            return getGameVals(false);
        case 'questionDuration':
            return wrapDBVal(500);
        default:
            return {
                update: (updateVal) => Promise.resolve(updateVal)
            }
    }
}

db.ref = ref;
module.exports = db;