import dbService from '../../services/dbService.js';

async function endGame(gameId) {
	const db = dbService.getDb();

	const gameData = await db.ref('games').child(gameId).once('value').then(snapshot => snapshot.val());
	
	if(gameData) {
		const { event: eventId} = gameData;

		return db.ref(`games/${gameId}`).update({
			showGameOver: true,
			showQuestionResults: false
		});
	}
	
	return Promise.reject(`Error: no game found for ID ${gameId}`);
}

function showBetweenQuestionScreen(gameId) {
	return dbService.getDb().ref(`games/${gameId}`).update({
		showQuestionResults: false,
		showBetweenQuestions: true
	})
}


function gameService() {
	return {
		endGame,
		showBetweenQuestionScreen
	};
}

export default gameService;