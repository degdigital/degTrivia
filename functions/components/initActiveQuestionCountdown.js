function writeCounts(change, questionId, optId, count) {
    return change.after.ref.parent.child(`questions/${questionId}/choices/${optId}`).update({
        chosenCount: count
    });
}

function updateFlags(change) {
    return change.after.ref.parent.update({
        activeQuestionId: false,
        showQuestionResults: true
    })
}

function generateCounts(db, change, questionId ) {
    return db.ref(`answers/${questionId}`).once('value').then(snapshot => {
        const questionAnswerData = snapshot.val();
        if (questionAnswerData) {
            const promises = Object.keys(questionAnswerData.responses).map(optId => {
                // TODO: potentially re-work to make a percentage
                writeCounts(change, questionId, optId, Object.keys(questionAnswerData.responses[optId]).length);
            });
            return Promise.all(promises);
        }
        return Promise.resolve();
    })
}

module.exports = function(db, change, context) {
    return db.ref('questionDuration').once('value')
        .then(snapshot => {
            const questionDuration = snapshot.val();
            const activeQuestionId = change.after.val();
            if (activeQuestionId === false) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(generateCounts(db, change, activeQuestionId)
                        .then(() => updateFlags(change)))
                }, questionDuration);
            });
        })
};