import firebase from '@firebase/app';
import '@firebase/database';

const dbService = function() {

	let db = null;
	const nodeNames = {
		events: 'events',
		series: 'series',
		games: 'games',
		pendingPlayers: 'pendingPlayers'
	};
	const defaultNodesToGet = [
		'events',
		'series',
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

	function getCurrentEventId() {
		return db.ref('currentEvent').once('value').then(snapshot => snapshot.val());
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
		const currentEventId = await getCurrentEventId();
		const games = await db.ref('games').orderByChild('event').equalTo(currentEventId).once('value').then(snapshot => snapshot.val());
		if (!games) {
			return Promise.resolve(null);
		}
		const nextGameTime = new Date(Object.keys(games).map(gameId => games[gameId].startTime).sort()[0]);
		return Promise.resolve(nextGameTime);
	}

	function submitAnswer(questionId, choiceId, playerId) {
		if (questionId && choiceId && playerId){
			return db.ref(`answers/${questionId}/responses/${choiceId}`).update({
				[playerId]: true
			});
		}
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

	return {
		init,
		getDb,
		getInitialData,
		getCurrentEventId,
		getEvent,
		getNextGameTime,
		submitAnswer,
		getLeaderboardData,
		getActiveGameData
	};

};

const instance = dbService();

export default instance;