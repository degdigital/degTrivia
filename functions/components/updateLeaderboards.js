function updateScore(db, ref) {
    return db.ref(ref).transaction(currentVal => (currentVal || 0) + 1);
}

function updatePlayerScore(db, playerId, eventId, seriesId, gameId) {
    if (playerId) {
        const gameBoardRef = db.ref(`leaderboardGame/${gameId}/${playerId}`);
        const seriesBoardRef = db.ref(`leaderboardSeries/${seriesId}/${playerId}`);
        const eventBoardRef = db.ref(`leaderboardEvent/${eventId}/${playerId}`);
        const promises = [
            updateScore(db, gameBoardRef),
            updateScore(db, seriesBoardRef),
            updateScore(db, eventBoardRef)
        ];
        return Promise.all(promises);
    }
}

module.exports = function(db, event, context){
    const questionId = event.before.val();
    if (questionId){
        return db.ref(`answers/${questionId}`).once('value').then(snapshot => {
            const questionRespData = snapshot.val();
            if (questionRespData) {
                const playersList = questionRespData.responses[questionRespData.correctChoiceId];
                const promises = Object.keys(playersList).map(playerId => {
                    updatePlayerScore(db, playerId, questionRespData.eventId, questionRespData.seriesId, questionRespData.gameId);
                });
                return Promise.all(promises);
            }
            return Promise.resolve();
        })
    }
    return Promise.resolve();
}