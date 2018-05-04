const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onQuestionActivation = functions.database.ref(`/games/{gameId}/activeQuestionId`).onUpdate(snapshot => {
	const activeQuestionId = snapshot.val();
	return snapshot.ref.parent.child('showQuestionResults').set(true);
});