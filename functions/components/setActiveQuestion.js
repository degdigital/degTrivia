module.exports = function(data, context, db, functions) {

	const gameId = data.gameId;
	const questionId = data.questionId;

	if (!isValidIdFormat(gameId) || !isValidIdFormat(questionId)) {
		throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid gameId and questionId.');
	}

	if (isUnauthorizedUser()) {
		throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
	}

	function getQuestionExpiration() {
		return db.ref('questionDuration').once('value').then(snapshot => {
			return snapshot.val() + Date.now();
		});
	}

	function saveGameVals(questionExpirationTime) {
		return db.ref(`/games/${gameId}`).update({
			activeQuestionId: questionId,
			questionExpirationTime: questionExpirationTime
		});
	}

	function isValidIdFormat(id = null) {
		return id && typeof id === 'string' && id.toString().length > 0;
	}

	function isUnauthorizedUser() {
		return !context.auth;
	}

	return new Promise((resolve, reject) => {
		getQuestionExpiration()
			.then(questionExpirationTime => saveGameVals(questionExpirationTime))
			.then(() => resolve({
				success: true
			}));
	});

};