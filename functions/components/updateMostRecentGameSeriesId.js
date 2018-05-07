function updateMostRecentGameId(newVal) {
    return db.ref().update({
        mostRecentGame: newVal
    });
}

function updateMostRecentSeriesId(gameId) {
    return db.ref(`games/${gameId}/series`).once('value').then(snapshot => {
        const seriesId = snapshot.val();
        if (seriesId) {
            return db.ref().update({
                mostRecentSeries: seriesId
            });
        }
    })
}

module.exports = function(db, change, context) {
    const gameId = change.after.val();

    if (gameId) {
        return Promise.all([
            updateMostRecentGameId(gameId),
            updateMostRecentSeriesId(gameId)
        ]);
    }
    return Promise.resolve();
}