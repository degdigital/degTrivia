const functions = require('firebase-functions');
const admin = require('firebase-admin');

const initActiveQuestionCountdown = require('./components/initActiveQuestionCountdown');
const initQuestionReponses = require('./components/initQuestionResponses');
const updateLeaderboards = require('./components/updateLeaderboards');
const cacheLeaderboardData = require('./components/cacheLeaderboardData');
const updateMostRecentEventId = require('./components/updateMostRecentEventId');
const updateMostRecentGameSeriesId = require('./components/updateMostRecentGameSeriesId');

admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.initActiveQuestionCountdown = functions.database.ref(`/games/{gameId}/activeQuestionId`)
    .onUpdate((change, context) => initActiveQuestionCountdown(db, change, context));

exports.initQuestionResponses = functions.database.ref('events/{eventId}/activeGameId')
    .onUpdate((change, context) => initQuestionReponses(db, change, context));

exports.updateLeaderboards = functions.database.ref('games/{gameId}/activeQuestionId')
    .onUpdate((change, context) => updateLeaderboards(db, change, context));

exports.cacheLeaderboardData = functions.database.ref('games/{gameId}/showGameOver')
    .onUpdate((change, context) => cacheLeaderboardData(change, context, db));

exports.updateMostRecentEventId = functions.database.ref('currentEvent')
    .onUpdate((change, context) => updateMostRecentEventId(db, change, context));

exports.updateMostRecentGameSeriesId = functions.database.ref('events/{eventId}/activeGameId')
    .onUpdate((change, context) => updateMostRecentGameSeriesId(db, change, context));