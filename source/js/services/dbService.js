import firebase from '@firebase/app';
import '@firebase/database';

const dbService = function() {

	let db = null;
	const nodeNames = {
		events: 'events',
		games: 'games',
		pendingPlayers: 'pendingPlayers'
	};
	let cachedCurrentEventId = null;

	function init() {
		db = firebase.database();
	}

	function getDb() {
		return db;
	}

	function getCurrentEventId() {
		if (cachedCurrentEventId) {
			return Promise.resolve(cachedCurrentEventId);
		} else {
			return db.ref('currentEvent').once('value').then(snapshot => {
				cachedCurrentEventId = snapshot.val();
				return cachedCurrentEventId;
			});
		}
		
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

	function submitAnswer(gameId, questionId, choiceId) {
		return Promise.resolve(true);
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

	function getGameLeaderboard() {
		// TODO: get top 10 players for most recent game
		return Promise.resolve({
			type: 'game',
			leaders: [
				{name: 'Anna', score: '1500000'},
				{name: 'Aaron', score: '140'},
				{name: 'Ryan', score: '42'}
			]
		})
	}

	function getDayLeaderboard() {
		// get top 10 people and scores for current day
		return Promise.resolve({
			type: 'day',
			leaders: [
				{name: 'Anna', score: '1500060'},
				{name: 'Aaron', score: '146'},
				{name: 'Ryan', score: '42'}
			]
		})
	}

	function getEventLeaderboard() {
		// get top 10 people and scores for current event
		return Promise.resolve({
			type: 'event',
			leaders: [
				{name: 'Aaron', score: '1500001'},
				{name: 'Aaron', score: '200'},
				{name: 'Ryan', score: '43'}
			]
		})
	}

	return {
		init,
		getDb,
		getCurrentEventId,
		getEvent,
		getNextGameTime,
		getGameLeaderboard,
		getDayLeaderboard,
		getEventLeaderboard,
		getActiveGameData
	};

};

const instance = dbService();

export default instance;