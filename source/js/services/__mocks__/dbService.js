const dbService = jest.genMockFromModule('./dbService');

let nextGameTime = null;

function submitAnswer() {
	return Promise.resolve(true);
}

function getLeaderboardData() {
	return Promise.resolve({
		game: [
			{name: 'Anna', score: '1500000'},
			{name: 'Aaron', score: '140'},
			{name: 'Ryan', score: '42'}
		],
		event: [
			{name: 'Aaron', score: '1500001'},
			{name: 'Aaron', score: '200'},
			{name: 'Ryan', score: '43'}
		]
	})
}

function getNextGameTime() {
	return nextGameTime;
}

function __setNextGameTime(newNextGameTime) {
	nextGameTime = newNextGameTime;
}

function getActiveEventId() {
	return 'eventId1';
}

dbService.submitAnswer = submitAnswer;
dbService.getLeaderboardData = getLeaderboardData;
dbService.getNextGameTime = getNextGameTime;
dbService.__setNextGameTime = __setNextGameTime;
dbService.getActiveEventId = getActiveEventId;

export default dbService;