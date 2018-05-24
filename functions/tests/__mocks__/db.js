'use strict';

const db = {};
const pathRegEx = {
    games: RegExp(/\bgames\/\b/),
    questionDuration: RegExp(/\bquestionDuration\b/),
    answers: RegExp(/\banswers\/\b/)
}
let gameVals = {}; // games node
let answerVals = {}; // answers node
let gameResultVals = {}; // gameResults node

function __setGameVals(vals) {
    gameVals = vals;
}

function __setAnswerVals(vals) {
    answerVals = vals;
}

function __setGameResultVals(vals) {
    gameResultVals = vals;
}

function wrapDBVal(retData) {
    return {
        once: () => Promise.resolve({
            val: () => retData
        })
    }
}

function transaction(callback) {
    return Promise.resolve(callback(gameResultVals));
}

function ref(path) {
    if (path) {
        if (pathRegEx.games.test(path)) {
            const gameId = path.split('/')[1];
            return wrapDBVal(gameVals[gameId]);
        }
        if (pathRegEx.questionDuration.test(path)) {
            return wrapDBVal(1000);
        }
        if (pathRegEx.answers.test(path)) {
            const questionId = path.split('/')[1];
            return wrapDBVal(answerVals[questionId])
        } 
    }
    return {
        update: updateVal => Promise.resolve(updateVal),
        transaction
    }
}

db.__setGameVals = __setGameVals;
db.clearGameVals = () => __setGameVals({});
db.__setAnswerVals = __setAnswerVals;
db.__setGameResultVals = __setGameResultVals;
db.ref = ref;
module.exports = db;