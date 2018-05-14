function writeCounts(change, questionId, optId, count) {
    return change.after.ref.parent.child(`questions/${questionId}/choices/${optId}`).update({
        chosenCount: count
    });
}

function updateFlag(change, newVal) {
    return change.after.ref.parent.update(newVal);
}

function generateCounts(db, change, questionId ) {
    return db.ref(`answers/${questionId}`).once('value').then(snapshot => {
        const questionAnswerData = snapshot.val();
        if (questionAnswerData && questionAnswerData.responses) {
            const promises = Object.keys(questionAnswerData.responses).map(optId => {
                // TODO: potentially re-work to make a percentage
                writeCounts(change, questionId, optId, Object.keys(questionAnswerData.responses[optId]).length);
            });
            return Promise.all(promises)
                .then(() => updateFlag(change, {showQuestionResults: true}));
        }
        return updateFlag(change, {showQuestionResults: true});
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
                    return Promise.all([
                        updateFlag(change, {activeQuestionId: false}),
                        generateCounts(db, change, activeQuestionId)
                    ]);
                }, questionDuration);
            });
        })
};