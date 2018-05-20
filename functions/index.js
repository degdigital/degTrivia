const functions = require('firebase-functions');
const admin = require('firebase-admin');

const initActiveQuestionCountdown = require('./components/initActiveQuestionCountdown');
const initQuestionReponses = require('./components/initQuestionResponses');
const updateLeaderboards = require('./components/updateLeaderboards');
const cacheLeaderboardData = require('./components/cacheLeaderboardData');
const updateMostRecentEventId = require('./components/updateMostRecentEventId');
const updateMostRecentGameId = require('./components/updateMostRecentGameId');
const sendPlayerDataToSFMC = require('./components/sendPlayerDataToSFMC');
const setActiveQuestion = require('./components/setActiveQuestion');

admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.initActiveQuestionCountdown = functions.database.ref(`/games/{gameId}/activeQuestionId`)
    .onUpdate((change, context) => initActiveQuestionCountdown(db, change, context));

exports.initQuestionResponses = functions.database.ref('events/{eventId}/activeGameId')
    .onUpdate((change, context) => initQuestionReponses(db, change, context));

exports.updateLeaderboards = functions.database.ref('games/{gameId}/activeQuestionId')
    .onUpdate((change, context) => updateLeaderboards(db, change, context));

exports.cacheLeaderboardData = functions.database.ref('games/{gameId}/showGameOver')
    .onUpdate((change, context) => cacheLeaderboardData(db, change, context));

exports.updateMostRecentEventId = functions.database.ref('activeEventId')
    .onUpdate((change, context) => updateMostRecentEventId(db, change, context));

exports.updateMostRecentGameId = functions.database.ref('events/{eventId}/activeGameId')
    .onUpdate((change, context) => updateMostRecentGameId(db, change, context));

exports.sendPlayerDataToSFMC = functions.database.ref(`players/{playerId}`)
	.onCreate((snapshot, context) => sendPlayerDataToSFMC(db, snapshot, context));

exports.setActiveQuestion = functions.https
	.onCall((data, context) => setActiveQuestion(data, context, db, functions));
