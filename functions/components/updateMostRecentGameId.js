module.exports = function(db, change, context) {
    const gameId = change.after.val();

    if (gameId) {
        return db.ref().update({
            mostRecentGame: gameId
        });;
    }
    return Promise.resolve();
}