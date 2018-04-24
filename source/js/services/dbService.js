const dbService = function() {

	const db = firebase.database();
	const refs = {
		events: null,
		players: null
	};

	function getRef(refName) {
		if (refs[refName]) {
			return refs[refName];
		}
		return db.ref(refName);
	}

	function getEvent(eventAlias) {
		const eventsRef = getRef('events');
		return eventsRef.orderByChild('alias').equalTo(eventAlias).once('value').then(snapshot => snapshot.val());
	}

	async function createInactivePlayer(playerVals) {
		const event = await getEvent(playerVals.eventAlias);
		const playersRef = getRef('players');
		const newUserKey = playersRef.push().key;
		const formattedPlayerVals = {
			firstName: playerVals.firstName,
			lastName: playerVals.lastName,
			email: playerVals.email,
			events: {
				[Object.keys(event)[0]]: true
			},
			active: false
		};
		const updates = {};
		updates[`/players/${newUserKey}`] = formattedPlayerVals;

		return db.ref().update(updates);
	}

	function getNextGameTime() {
		// TODO: return the start time of next game for the event in UTC
		// new Date() will convert it to local time
		return Promise.resolve(new Date('May 5, 2018 12:00:00'));
	}

	function submitAnswer(gameId, questionId, choiceId) {
		return Promise.resolve(true);
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
		db,
		getEvent,
		createInactivePlayer,
		getNextGameTime,
		getGameLeaderboard,
		getDayLeaderboard,
		getEventLeaderboard
	};

};

const instance = dbService();

export default instance;