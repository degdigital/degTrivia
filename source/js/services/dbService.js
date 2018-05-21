import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/functions';

const dbService = function() {

	let db = null;
	const nodeNames = {
		events: 'events',
		games: 'games',
		pendingPlayers: 'pendingPlayers'
	};
	const defaultNodesToGet = [
		'events',
		'games'
	];

	function init() {
		db = firebase.database();
	}

	function getDb() {
		return db;
	}

	function getInitialData(nodes = defaultNodesToGet) {
		return new Promise(async(resolve, reject) => {
			let output = {};
			const data = await Promise.all(nodes.map(node => db.ref(node).once('value').then(snapshot => snapshot.val())));
			nodes.map((node, index) => output[node] = data[index]);
			resolve(output);
		});
	}

	function getActiveEventId() {
		return db.ref('activeEventId').once('value').then(snapshot => snapshot.val());
	}

	function getEvent(eventAlias) {
		return db.ref('events').orderByChild('alias').equalTo(eventAlias).once('value').then(snapshot => snapshot.val());
	}

	function createPendingPlayer(playerVals, eventKey, userId) {
		const pendingPlayerKey = db.ref(nodeNames.pendingPlayers).push().key;
		
		return db.ref(`/${nodeNames.pendingPlayers}/${pendingPlayerKey}`).update(formattedPlayerVals)
			.then(() => pendingPlayerKey);
	}

	async function getNextGameTime() {
		const activeEventId = await getActiveEventId();
		const games = await db.ref('games').orderByChild('event').equalTo(activeEventId).once('value').then(snapshot => snapshot.val());
		if (!games) {
			return Promise.resolve(null);
		}
		let nextGameTime;
		const now = Date.now();
		const gameTimes = Object.keys(games).map(gameId => games[gameId].startTime)
			.filter(gameTime => gameTime >= now);

		if (gameTimes) {
			nextGameTime = new Date(gameTimes.sort()[0]);
		}
		return Promise.resolve(nextGameTime);
	}

	async function getQuestionResults(gameId, questionId) {
		const questionResults = await db.ref(`games/${gameId}/questions/${questionId}`).once('value').then(snapshot => snapshot.val());
		questionResults.id = questionId;
		return {
			questionData: questionResults
		};
	}

	function submitAnswer(questionId, choiceId, playerId) {
		const submitA = firebase.functions().httpsCallable('submitAnswer');
		submitA({
			questionId,
			choiceId,
			playerId
		});
	}

	function setActiveQuestion(gameId, questionId) {
		const setActiveQ = firebase.functions().httpsCallable('setActiveQuestion');
		setActiveQ({
			gameId: gameId,
			questionId: questionId
		});
	}

	function getQuestionExpirationTime(gameId) {
		return db.ref(`games/${gameId}/questionExpirationTime`).once('value').then(snapshot => snapshot.val());
	}

	function getActiveGameData(gameId) {
		return new Promise((resolve, reject) => {
			db.ref(`games/${gameId}`).once('value', snapshot => {
				if (snapshot.exists()) {
					resolve(snapshot.val());	
				} else {
					reject();
				}
			});
		});
	}

	function getLeaderboardData() {
		return db.ref('leaderboardCurrent').once('value').then(snapshot => {
			if (snapshot.val()) {
				return snapshot.val();
			} else {
				return {};
			}
		})
	}

	function getMostRecentGameId() {
		return db.ref('mostRecentGame').once('value').then(snapshot => snapshot.val());
	}

	async function getPlayerScore(playerId) {
		const recentGameId = await getMostRecentGameId();
		return db.ref(`playerResultsGame/${recentGameId}/${playerId}`).once('value').then(snapshot => (snapshot.val() && snaphot.val().score) || 0);
	}

	return {
		init,
		getDb,
		getInitialData,
		getActiveEventId,
		getEvent,
		getNextGameTime,
		submitAnswer,
		setActiveQuestion,
		getLeaderboardData,
		getActiveGameData,
		getPlayerScore,
		getQuestionResults,
		getQuestionExpirationTime
	};

};

const instance = dbService();

export default instance;