import firebase from '@firebase/app';
import '@firebase/database';

const dbService = function() {

	let db = null;
	const nodeNames = {
		pendingPlayers: 'pendingPlayers',
		activePlayers: 'activePlayers'
	};
	const refs = {
		events: null,
		activePlayers: null,
		pendingPlayers: null
	};
	let cachedCurrentEventId = null;

	function init() {
		db = firebase.database();
	}

	function getDb() {
		return db;
	}

	function getRef(refName) {
		return refs[refName] ? refs[refName] : db.ref(refName);
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
		const eventsRef = getRef('events');
		return eventsRef.orderByChild('alias').equalTo(eventAlias).once('value').then(snapshot => snapshot.val());
	}

	function createPendingPlayer(playerVals, eventKey) {
		const pendingPlayersRef = getRef(nodeNames.pendingPlayers);
		const pendingPlayerKey = pendingPlayersRef.push().key;
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
		const pendingPlayersRef = getRef(nodeNames.pendingPlayers);
		return pendingPlayersRef.child(`${pendingKey}/${value}`).once('value').then(snapshot => snapshot.val());
	}

	function getNextGameTime() {
		// TODO: return the start time of next game for the event in UTC
		// new Date() will convert it to local time
		return Promise.resolve(new Date('May 5, 2018 12:00:00'));
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