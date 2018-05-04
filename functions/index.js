const functions = require('firebase-functions');

function updateLeaderboardScore(ref) {
    return admin.database().ref(ref).transaction(currentVal => (currentVal || 0) + 1);
}

function updatePlayerScore(playerId, eventId, seriesId, gameId) {
    if (playerId) {
        const gameBoardRef = admin.database().ref(`leaderboardGame/${gameId}/${playerId}`);
        const seriesBoardRef = admin.database().ref(`leaderboardSeries/${seriesId}/${playerId}`);
        const eventBoardRef = admin.database().ref(`leaderboardEvent/${eventId}/${playerId}`);
        const promises = [
            updateLeaderboardScore(gameBoardRef),
            updateLeaderboardScore(seriesBoardRef),
            updateLeaderboardScore(eventBoardRef)
        ];
        return Promise.all(promises);
    }
}

exports.updateLeaderboard = functions.database.ref('games/{gameId}/activeQuestionId')
    .onWrite((change, context) => {
        const questionId = change.before.val();
        if (questionId){
           return admin.database().ref(`answers/${questionId}`).once('value').then(snapshot => {
               const questionRespData = snapshot.val();
               const playersList = questionRespData.responses[questionRespData.correctChoice];
               const promises = [];
               Object.keys(playersList).forEach(playerId => {
                   promises.push(updatePlayerScore(playerId, questionRespData.eventId, questionRespData.seriesId, questionRespData.gameId));
               });
               return Promise.all(promises);
           })
        }
       return Promise.resolve();
    })