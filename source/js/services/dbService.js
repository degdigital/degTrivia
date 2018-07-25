import firebase from '@firebase/app';
import '@firebase/database';
import '@firebase/functions';

const dbService = function() {

	let db = null;
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

	function getEventById(id) {
		return db.ref(`events/${id}`)
			.once('value')
			.then(snapshot => snapshot.val());
	}

	function getEvent(eventAlias) {
		return db.ref('events').orderByChild('alias').equalTo(eventAlias.toLowerCase()).once('value').then(snapshot => snapshot.val());
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

		if (gameTimes && gameTimes.length > 0) {
			nextGameTime = new Date(gameTimes.sort()[0]);
		} else {
			nextGameTime = null;
		}
		return Promise.resolve(nextGameTime);
	}

	async function getQuestionResults(gameId, questionId, uid) {
		const promises = await Promise.all([
			db.ref(`games/${gameId}/questions/${questionId}`).once('value').then(snapshot => snapshot.val()),
			db.ref(`answers/${questionId}/responses`).once('value').then(snapshot => snapshot.val())
		]);
		const questionResults = promises[0];
		const answers = promises[1];
		questionResults.id = questionId;
		return {
			questionData: questionResults,
			userChoiceId: getUserChoiceId(answers, uid)
		};
	}

	function getUserChoiceId(answers, uid) {
		if (!answers) {
			return null;
		}
		const userChoiceId = Object.keys(answers).find(key => {
			return Object.keys(answers[key]).includes(uid);
		});
		return userChoiceId || null; 
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
		return db.ref(`playerResultsGame/${recentGameId}/${playerId}`).once('value').then(snapshot => (snapshot.val() && snapshot.val().score) || 0);
	}

	return {
		init,
		getDb,
		getInitialData,
		getActiveEventId,
		getEvent,
		getEventById,
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