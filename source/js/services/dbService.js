import firebase from '@firebase/app';
import '@firebase/database';

const dbService = function() {

	let db = null;
	const nodeNames = {
		events: 'events',
		games: 'games',
		pendingPlayers: 'pendingPlayers',
		activePlayers: 'activePlayers'
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

	function createPendingPlayer(playerVals, eventKey) {
		const pendingPlayerKey = db.ref(nodeNames.pendingPlayers).push().key;
		const formattedPlayerVals = {
			firstName: playerVals.firstName,
			lastName: playerVals.lastName,
			email: playerVals.email,
			events: {
				[eventKey]: true
			}
		};
		return db.ref(`/${nodeNames.pendingPlayers}/${pendingPlayerKey}`).update(formattedPlayerVals)
			.then(() => pendingPlayerKey);
	}

	async function createActivePlayer(user, pendingKey) {
		const pendingPlayerVals = await getPendingPlayer(pendingKey);
		const updates = {};
		updates[`/${nodeNames.pendingPlayers}/${pendingKey}`] = null;
		updates[`/${nodeNames.activePlayers}/${user.uid}`] = pendingPlayerVals;
		return db.ref().update(updates);
	}

	function getPendingPlayer(pendingKey, value = '') {
		return db.ref(nodeNames.pendingPlayers).child(`${pendingKey}/${value}`).once('value').then(snapshot => snapshot.val());
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

	return {
		init,
		getDb,
		getCurrentEventId,
		getEvent,
		createPendingPlayer,
		createActivePlayer,
		getPendingPlayer,
		getNextGameTime
	};

};

const instance = dbService();

export default instance;