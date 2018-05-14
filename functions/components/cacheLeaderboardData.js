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
            return database.ref(`${leaderboardRef}/${id}`).orderByValue().limitToLast(10).once('value').then(leaderboardSnap => {
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
    return database.ref('players').once('value').then(snap => {
        const players = snap.val();
        if (players) {
            const retVal = {};
            playerIds.forEach(id => retVal[id] = `${players[id].firstName} ${players[id].lastName}`)
            return retVal;
        }
        return {};
    })
}

// sorts leaderboard from highest to lowest scores
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
            return 0;
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
                score: leaderboardData.leaders[id]
            }
        })
    
        return database.ref(`leaderboardCurrent/${leaderboardData.type}`).set(sortLeaderboard(currentLeaderboardData));
    }
    return Promise.resolve();
}
    
module.exports = function(event, context, db) {
    if (event.after.val()){
        if (!database) {
            database = db;
        }
        const promises = [
            formatBoard('mostRecentGame', 'leaderboardGame', 'game'),
            formatBoard('mostRecentEvent', 'leaderboardEvent', 'event')
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
                return Promise.all(writePromises);
            })
        })
    }
    return Promise.resolve();
}