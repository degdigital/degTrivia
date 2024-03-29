let database;

/**
 * 
 * @param {*} idRef the id of the game, series or event
 * @param {*} leaderboardRef the path to the corresponding node in the database
 * @param {*} type which type of leadersboard (game, series, event)
 * @returns {Promise(Object)} returns an object with the type of data and the top 10 scores
 */
function formatBoard(idRef, leaderboardRef, type) {
    return database.ref(idRef).once('value').then(snapshot => {
        const id = snapshot.val();
        if (id) {
            return database.ref(`${leaderboardRef}/${id}`).orderByChild('indexVal').limitToLast(10).once('value').then(leaderboardSnap => {
                const leaderboardData = leaderboardSnap.val();
                return {
                    type,
                    leaders: leaderboardData
                };
            })
        }
        return Promise.resolve();
    })
}

/**
 * 
 * @param {String[]} playerIds a list of the unique player ids
 * @returns {Object} an object where the keys are player ids and the values are the display name for the player
 */
function getPlayerNameIdMap(playerIds) {
    if (playerIds && playerIds.length) {
        return database.ref('players').once('value').then(snap => {
            const players = snap.val();
            if (players) {
                const retVal = {};
                playerIds.forEach(id => {
                    if (players[id]) {
                        retVal[id] = `${players[id].firstName} ${players[id].lastName[0].toUpperCase()}.`;
                    } else {
                        retVal[id] = 'Anonymous Player';
                    }
                })
                return retVal;
            }
            return {};
        })
    }
    return Promise.resolve({});
}

function sortLeaderboard(currentLeaderboardData) {
    if (currentLeaderboardData) {
        const data = [...currentLeaderboardData];
        data.sort((person1, person2) => {
            if (person1.score > person2.score) {
                return -1;
            }
            if (person2.score > person1.score) {
                return 1;
            }
            if (person1.score === person2.score) {
                return person1.timeElapsed < person2.timeElapsed ? -1 : 1;
            }
        })
        return data;
    }
    return currentLeaderboardData;
}

// writes leaderboard data to current leaderboard node
function writeCurrentLeaderboard(leaderboardData, idToNameMap) {
    if (leaderboardData.leaders) {
        const currentLeaderboardData = Object.keys(leaderboardData.leaders).map(id => {
            return {
                name: idToNameMap[id],
                score: leaderboardData.leaders[id].score,
                timeElapsed: leaderboardData.leaders[id].timeElapsed
            }
        })
        return database.ref(`leaderboardCurrent/${leaderboardData.type}`).set(sortLeaderboard(currentLeaderboardData));
    }
    return Promise.resolve();
}
    
function setShowResultsFlag(dbRef) {
    return dbRef.ref.parent.update({
        showGameOver: false,
        showGameResults: true
    })
}

module.exports = function(db, event, context) {
    if (event.after.val()){
        if (!database) {
            database = db;
        }
        const promises = [
            formatBoard('mostRecentGame', 'playerResultsGame', 'game'),
            formatBoard('mostRecentEvent', 'playerResultsEvent', 'event')
        ];
        return Promise.all(promises).then(results => {
            let playerIds = [];
            results.forEach(currentVal => {
                if(currentVal.leaders){
                    playerIds = [...playerIds, ...Object.keys(currentVal.leaders)];
                }
            });
            const uniquePlayerIds = [...new Set(playerIds)];
            return getPlayerNameIdMap(uniquePlayerIds).then(idToNameMap => {
                const writePromises = results.map(leaderboardData => writeCurrentLeaderboard(leaderboardData, idToNameMap));
                return Promise.all(writePromises).then(() => setShowResultsFlag(event.after));
            })
        })
    }
    return Promise.resolve();
}