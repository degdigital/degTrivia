const auth = firebase.auth();

const authService = function() {
	
	return {
		auth
	};

};

const instance = authService();

export default instance;