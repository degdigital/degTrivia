module.exports = function(data, context, db, functions) {

	const gameId = data.gameId;
	const questionId = data.questionId;

	function init() {
		handleErrors();
		if (questionId === false) {
			return saveGameVals();
		} else {
			return getQuestionExpiration().then(times => {
				return Promise.all([
					saveGameVals(questionId, times.expirationTime),
					updateAnswersNode(questionId, times.startTime, times.expirationTime)
				]);
			});
		}
	}

	function getQuestionExpiration() {
		return db.ref('questionDuration').once('value').then(snapshot => {
			const startTime = Date.now();
			return {
				expirationTime: snapshot.val() + startTime,
				startTime: startTime
			};
		});
	}

	function saveGameVals(questionId = false, questionExpirationTime = null) {
		return db.ref(`/games/${gameId}`).update({
			activeQuestionId: questionId,
			questionExpirationTime: questionExpirationTime,
			showBetweenQuestions: false
		});
	}

	function updateAnswersNode(questionId, qStartTime, qEndTime) {
		return db.ref(`/answers/${questionId}`).update({
			startTime: qStartTime,
			endTime: qEndTime
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