const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.onQuestionActivation = functions.database.ref(`/games/{gameId}/activeQuestionId`).onUpdate(event => {
	return admin.database().ref('questionDuration').once('value')
		.then(snapshot => {
			const questionDuration = snapshot.val();
			const activeQuestionId = event.data.val();
			if (activeQuestionId === false) {
				return Promise.resolve();
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => event.data.adminRef.parent.update({
					activeQuestionId: false,
					showQuestionResults: true
				}), questionDuration);
			});
		})
		.catch(error => console.log(error));
});