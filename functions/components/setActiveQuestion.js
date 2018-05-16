module.exports = function(data, context, admin) {

	const gameId = data.gameId;
	const questionId = data.questionId;

	function getQuestionExpirationTime() {
		return admin.database().ref('questionDuration').once('value').then(snapshot => {
			return snapshot.val() + Date.now();
		});
	}

	function saveGameVals(questionExpirationTime) {
		return admin.database().ref(`/games/${gameId}`).update({
			activeQuestionId: questionId,
			expires: questionExpirationTime
		});
	}

	return new Promise((resolve, reject) => {
		getQuestionExpirationTime()
			.then(questionExpirationTime => saveGameVals(questionExpirationTime))
			.then(() => resolve({
				success: true
			}));
	});

};