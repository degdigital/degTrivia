const playerService = jest.genMockFromModule('./playerService');

const authData = {
	uid: '123'
};

function getAuth() {
	return authData;
}

playerService.getAuth = getAuth;
playerService.__authData = authData;

export default playerService;