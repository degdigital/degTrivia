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

function updateScore(ref) {
    return admin.database().ref(ref).transaction(currentVal => (currentVal || 0) + 1);
}

function updatePlayerScore(playerId, eventId, seriesId, gameId) {
    if (playerId) {
        const gameBoardRef = admin.database().ref(`leaderboardGame/${gameId}/${playerId}`);
        const seriesBoardRef = admin.database().ref(`leaderboardSeries/${seriesId}/${playerId}`);
        const eventBoardRef = admin.database().ref(`leaderboardEvent/${eventId}/${playerId}`);
        const promises = [
            updateScore(gameBoardRef),
            updateScore(seriesBoardRef),
            updateScore(eventBoardRef)
        ];
        return Promise.all(promises);
    }
}

exports.updateLeaderboards = functions.database.ref('games/{gameId}/activeQuestionId')
    .onUpdate((event, context) => {
        const questionId = event.before.val();
        if (questionId){
           return admin.database().ref(`answers/${questionId}`).once('value').then(snapshot => {
               const questionRespData = snapshot.val();
               const playersList = questionRespData.responses[questionRespData.correctChoice];
               const promises = Object.keys(playersList).map(playerId => {
                   updatePlayerScore(playerId, questionRespData.eventId, questionRespData.seriesId, questionRespData.gameId);
               });
               return Promise.all(promises);
           })
        }
       return Promise.resolve();
    })