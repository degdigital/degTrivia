const dbService = jest.genMockFromModule('./dbService');

let nextGameTime = null;

function submitAnswer() {
	return Promise.resolve(true);
}

function getLeaderboardData() {
	return Promise.resolve({
		game: [
			{name: 'Anna', score: '1500000', timeElapsed: '8103'},
			{name: 'Aaron', score: '140', timeElapsed: '81030'},
			{name: 'Ryan', score: '42', timeElapsed: '72030'}
		],
		event: [
			{name: 'Aaron', score: '1500001', timeElapsed: '8103'},
			{name: 'Aaron', score: '200', timeElapsed: '81030'},
			{name: 'Ryan', score: '43', timeElapsed: '72030'}
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