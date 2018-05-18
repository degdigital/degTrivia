function updateScore(db, ref, timeElapsed) {
    return db.ref(ref).transaction(currentVal => {
        const newVal = currentVal;
        if (currentVal) {
            newVal.score++;
            newVal.timeElapsed = currentVal.timeElapsed + timeElapsed;
        } else {
            newVal.score = 1;
            newVal.timeElapsed = timeElapsed;
        }
        return newVal;
    });
}

function updatePlayerScore(db, playerId, eventId, gameId, timeElapsed) {
    if (playerId) {
        const gameBoardRef = db.ref(`playerResultsGame/${gameId}/${playerId}`);
        const eventBoardRef = db.ref(`playerResultsEvent/${eventId}/${playerId}`);
        const promises = [
            updateScore(db, gameBoardRef, timeElapsed),
            updateScore(db, eventBoardRef, timeElapsed)
        ];
        return Promise.all(promises);
    }
}

function getElapsedTime(qStartTime, answerTime) {
    return answerTime - qStartTime;
}

module.exports = function(db, event, context){
    const questionId = event.before.val();
    if (questionId){
        return db.ref(`answers/${questionId}`).once('value').then(snapshot => {
            const questionRespData = snapshot.val();
            if (questionRespData && questionRespData.responses) {
                const playersList = questionRespData.responses[questionRespData.correctChoiceId] || [];
                const promises = Object.keys(playersList).map(playerId => {
                    const timeElapsed = getElapsedTime(questionRespData.startTime, playersList[playerId]); 
                    updatePlayerScore(db, playerId, questionRespData.eventId, questionRespData.gameId, timeElapsed);
                });
                return Promise.all(promises);
            }
            return Promise.resolve();
        })
    }
    return Promise.resolve();
}