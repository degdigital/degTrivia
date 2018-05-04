const functions = require('firebase-functions');

function initQuestionResponsesNode(eventId, seriesId, gameId, questionId, correctChoiceId) {
    return admin.database().ref('answers').update({
        [questionId]: {
            eventId,
            seriesId,
            gameId,
            correctChoiceId
        }
    })
}

exports.initQuestionResponses =  functions.database.ref('events/{eventId}/activeGameId')
    .onUpdate((event, context) => {
        const gameId = event.after.val();
        if (gameId) {
            return admin.database().ref(`games/${gameId}`).once('value').then(gameSnap => {
                const data = gameSnap.val();
                if (data) {
                    const questions = data.questions;
                    const promises = Object.keys(questions).map(qId => {
                        return initQuestionResponsesNode(context.params.eventId, data.series, gameId, qId, questions[qId].correctChoice);
                    })
                    return Promise.all(promises);
                }
            })
        }
        return Promise.resolve();
    })