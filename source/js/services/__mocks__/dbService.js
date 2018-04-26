const dbService = jest.genMockFromModule('./dbService');

function submitAnswer() {
	return Promise.resolve(true);
}

function getGameLeaderboard() {
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
	return Promise.resolve(null);
}

function getEventLeaderboard() {
	return Promise.resolve({
		type: 'event',
		leaders: [
			{name: 'Aaron', score: '1500001'},
			{name: 'Aaron', score: '200'},
			{name: 'Ryan', score: '43'}
		]
	})
}

dbService.submitAnswer = submitAnswer;
dbService.getDayLeaderboard = getDayLeaderboard;
dbService.getGameLeaderboard = getGameLeaderboard;
dbService.getEventLeaderboard =  getEventLeaderboard;

export default dbService;