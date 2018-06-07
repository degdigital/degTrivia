function updateScore(db, ref, timeElapsed, timeRemaining) {
    return db.ref(ref).transaction(currentVal => {
        let newScore;
        let newTimeElapsed;
        let newTimeRemaining;
        let indexVal;

        if (currentVal) {
            newScore = currentVal.score + 1;
            newTimeElapsed = currentVal.timeElapsed + timeElapsed;
            newTimeRemaining = currentVal.timeRemaining + timeRemaining;
        } else {
            newScore = 1;
            newTimeElapsed = timeElapsed;
            newTimeRemaining = timeRemaining;
        }
        indexVal = `${padTimeLeft(newScore.toString(), 4)}||${padTimeLeft(newTimeRemaining.toString(), 8)}`; // necessary evil for optimized sorting
        return {
            score: newScore,
            timeElapsed: newTimeElapsed,
            timeRemaining: newTimeRemaining,
            indexVal
        };
    });
}

function updatePlayerScore(db, playerId, eventId, gameId, timeElapsed, timeRemaining) {
    if (playerId) {
        const gameBoardRef = db.ref(`playerResultsGame/${gameId}/${playerId}`);
        const eventBoardRef = db.ref(`playerResultsEvent/${eventId}/${playerId}`);
        const promises = [
            updateScore(db, gameBoardRef, timeElapsed, timeRemaining),
            updateScore(db, eventBoardRef, timeElapsed, timeRemaining)
        ];
        return Promise.all(promises);
    }
    return Promise.reject('No player id to update score');
}

function getElapsedTime(qStartTime, answerTime) {
    return answerTime - qStartTime;
}

function padTimeLeft(timeLeft, maxDigits) {
    const numToPad = maxDigits - timeLeft.length;
    for( let i = 0; i < numToPad; i++) {
        timeLeft = '0' + timeLeft;
    }

    return timeLeft;
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
                    const timeLeftInQ = questionRespData.endTime - playersList[playerId];
                    return updatePlayerScore(db, playerId, questionRespData.eventId, questionRespData.gameId, timeElapsed, timeLeftInQ);
                });

                return Promise.all(promises);
            }
            return Promise.resolve();
        })
    }
    return Promise.resolve();
}