import dbService from '../../services/dbService.js';

async function endGame(gameId) {
	const db = dbService.getDb();

	const gameData = await db.ref('games').child(gameId).once('value').then(snapshot => snapshot.val());
	
	if(gameData) {
		const { event: eventId} = gameData;

		const eventPromise = db.ref(`events/${eventId}`).update({
			activeGameId: false
		});

		const gamePromise = db.ref(`games/${gameId}`).update({
			showGameResults: true
		});

		return Promise.all([eventPromise, gamePromise]);
	}
	
	return Promise.reject(`Error: no game found for ID ${gameId}`);
}


function gameService() {
	return {
		endGame
	};
}

export default gameService;