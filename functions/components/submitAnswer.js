module.exports = function(db, functions, data) {
    const questionId = data.questionId;
    const choiceId = data.choiceId;
    const playerId = data.playerId;

    function init() {
        if (questionId && choiceId && playerId){
            const submissionTime = Date.now();
			return db.ref(`answers/${questionId}/responses/${choiceId}`).update({
                [playerId]: submissionTime,
			});
        } else {
            throw new functions.https.HttpsError('unexpected parameter', 'Missing ID. Could not save answer')
        }
    }

    init();
};