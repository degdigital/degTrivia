module.exports = function(data, context, db, functions) {

	const gameId = data.gameId;
	const questionId = data.questionId;

	function init() {
		handleErrors();
		if (questionId === false) {
			return saveGameVals();
		} else {
			return getQuestionExpiration().then(questionExpirationTime => saveGameVals(questionId, questionExpirationTime));
		}
	}

	function getQuestionExpiration() {
		return db.ref('questionDuration').once('value').then(snapshot => {
			return snapshot.val() + Date.now();
		});
	}

	function saveGameVals(questionId = false, questionExpirationTime = null) {
		return db.ref(`/games/${gameId}`).update({
			activeQuestionId: questionId,
			questionExpirationTime: questionExpirationTime
		});
	}

	function isValidIdFormat(id = null) {
		return id && typeof id === 'string' && id.toString().length > 0;
	}

	function isAuthorizedUser() {
		return context.auth;
	}

	function handleErrors() {
		if (!isValidIdFormat(gameId)) {
			throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid gameId.');
		}

		if (!isAuthorizedUser()) {
			throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
		}
	}

	init();

};