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
                writeCounts(change, questionId, optId, Object.keys(questionAnswerData.responses[optId]).length);
            });
            return Promise.all(promises)
                .then(() => updateFlag(change, {showQuestionResults: questionId}));
        }
        return updateFlag(change, {showQuestionResults: questionId});
    })
}

module.exports = function(db, change, context) {
    const activeQuestionId = change.after.val();
    if (!activeQuestionId) {
        return Promise.resolve();
    }
    return db.ref('questionDuration').once('value')
        .then(snapshot => {
            const questionDuration = snapshot.val();
            return new Promise((resolve, reject) => {
                setTimeout(() => { 
                    resolve(Promise.all([
                        updateFlag(change, {activeQuestionId: false}),
                        generateCounts(db, change, activeQuestionId)
                    ]));
                }, questionDuration);
            });
        })
};