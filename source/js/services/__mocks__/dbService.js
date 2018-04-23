const dbService = jest.genMockFromModule('./dbService');

function submitAnswer() {
	return Promise.resolve(true);
}

dbService.submitAnswer = submitAnswer;

export default dbService;