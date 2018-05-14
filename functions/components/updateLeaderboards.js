function updateScore(db, ref) {
    return db.ref(ref).transaction(currentVal => (currentVal || 0) + 1);
}

function updatePlayerScore(db, playerId, eventId, gameId) {
    if (playerId) {
        const gameBoardRef = db.ref(`playerResultsGame/${gameId}/${playerId}`);
        const eventBoardRef = db.ref(`playerResultsEvent/${eventId}/${playerId}`);
        const promises = [
            updateScore(db, gameBoardRef),
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
                const playersList = questionRespData.responses[questionRespData.correctChoiceId] || [];
                const promises = Object.keys(playersList).map(playerId => {
                    updatePlayerScore(db, playerId, questionRespData.eventId, questionRespData.gameId);
                });
                return Promise.all(promises);
            }
            return Promise.resolve();
        })
    }
    return Promise.resolve();
}