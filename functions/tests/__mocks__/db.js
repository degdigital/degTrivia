'use strict';

const db = {};
const pathRegEx = {
    games: RegExp(/\bgames\/\b/)
}
let gameVals = {};

// utility functions
function __setGameVals(vals) {
    gameVals = vals;
}

function clearGameVals() {
    gameVals = {};
}

function wrapDBVal(retData) {
    return {
        once: () => Promise.resolve({
            val: () => retData
        })
    }
}

// mock
function getGameVals(gameId) {
    return wrapDBVal(gameVals[gameId]);
}

function ref(path) {
    if (path) {
        if (pathRegEx.games.test(path)) {
            const gameId = path.split('/')[1];
            return getGameVals(gameId);
        }
    }

    return {
        update: updateVal => Promise.resolve(updateVal)
    }
}

db.__setGameVals = __setGameVals;
db.clearGameVals = clearGameVals;
db.ref = ref;
module.exports = db;