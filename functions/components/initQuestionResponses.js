function initQuestionResponsesNode(db, eventId, seriesId, gameId, questionId, correctChoiceId) {
    return db.ref('answers').update({
        [questionId]: {
            eventId,
            seriesId,
            gameId,
            correctChoiceId
        }
    })
}

module.exports = function(db, change, context) {
    const gameId = change.after.val();
    if (gameId) {
        return db.ref(`games/${gameId}`).once('value').then(gameSnap => {
            const data = gameSnap.val();
            if (data) {
                const questions = data.questions;
                const promises = Object.keys(questions).map(qId => {
                    return initQuestionResponsesNode(db, context.params.eventId, data.series, gameId, qId, questions[qId].correctChoice);
                })
                return Promise.all(promises);
            }
        })
    }
    return Promise.resolve();
}