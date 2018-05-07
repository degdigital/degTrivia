module.exports = function(db, change, context) {
    return db.ref('questionDuration').once('value')
        .then(snapshot => {
            const questionDuration = snapshot.val();
            const activeQuestionId = change.after.val();
            if (activeQuestionId === false) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => change.after.ref.parent.update({
                    activeQuestionId: false,
                    showQuestionResults: true
                }), questionDuration);
            });
        })
        .catch(error => console.log(error));
};