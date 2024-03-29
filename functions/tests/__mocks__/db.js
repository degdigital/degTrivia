'use strict';

const db = {};
const pathRegEx = {
    games: RegExp(/\bgames\/\b/),
    questionDuration: RegExp(/\bquestionDuration\b/),
    answers: RegExp(/\banswers\/\b/),
    mostRecent: RegExp(/(\bmostRecent)+.*/),
    results: RegExp(/.*\/\bmostRecentId1\b/)
}
let gameVals = {}; // games node
let answerVals = {}; // answers node
let gameResultVals = {}; // gameResults node
let players = {}; // players node
let leaderboard = {}; // leaderboardCurrent node

function __setGameVals(vals) {
    gameVals = vals;
}

function __setAnswerVals(vals) {
    answerVals = vals;
}

function __setGameResultVals(vals) {
    gameResultVals = vals;
}

function __setPlayers(vals) {
    players = vals;
}

function wrapDBVal(retData) {
    return {
        once: () => Promise.resolve({
            val: () => retData
        })
    }
}

function getQueryObj() {
    return {
        orderByChild: () => ({
            limitToLast: () => wrapDBVal(gameResultVals)
        })
    }
}

function transaction(callback) {
    return Promise.resolve(callback(gameResultVals));
}

function set(newVal) {
    leaderboard = newVal;
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
            return wrapDBVal(answerVals[questionId]);
        }
        if (pathRegEx.results.test(path)) {
            return getQueryObj();
        }
        if (pathRegEx.mostRecent.test(path)) {
            return wrapDBVal('mostRecentId1');
        }
        if (path === 'players') {
            return wrapDBVal(players);
        }
    }
    return {
        update: updateVal => Promise.resolve(updateVal),
        transaction,
        set
    }
}

db.__setGameVals = __setGameVals;
db.clearGameVals = () => __setGameVals({});
db.__setAnswerVals = __setAnswerVals;
db.__setGameResultVals = __setGameResultVals;
db.__setPlayers = __setPlayers;
db.getLeaderboard = () => leaderboard;
db.ref = ref;
module.exports = db;