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

	function createPlayer(playerData = null) {
		return new Promise((resolve, reject) => {
			const playersRef = getRef('players');
			playersRef.orderByChild('email').equalTo(playerData.email).once('value').then(snapshot => {
				const player = snapshot.val();
				
				resolve();
			});
		});
	}

	function submitAnswer(gameId, questionId, choiceId) {
		return Promise.resolve(true);
	}

	return {
		db,
		getEvent,
		createPlayer
	};

};

const instance = dbService();

export default instance;