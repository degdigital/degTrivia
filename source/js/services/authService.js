const auth = firebase.auth();
const currentUrl = window.location.href;
const localStorageKey = 'degTrivia';

const authService = function() {

	function registerPlayer(email = null, eventAlias) {
		return new Promise((resolve, reject) => {
			if (!email || email.length === 0) {
				reject('You must provide an email address');
			}
			auth.sendSignInLinkToEmail(email, {
				url: `${currentUrl}?finishSignup=1`,
				handleCodeInApp: true
			})
				.then(() => {
					setEventEmailToLS(eventAlias, email);
					resolve('success! check your email');
				})
				.catch(error => {
					console.log(error);
					reject('something went wrong');
				});
		});
	}

	function authorizePlayer(eventAlias) {
		return new Promise((resolve, reject) => {
			if (auth.currentUser) {
				resolve();
			} else if (auth.isSignInWithEmailLink(currentUrl)) {
				let email = getEventEmailFromLS(eventAlias);
				if (!email) {
					email = window.prompt('Please provide your email for confirmation');
				}
				firebase.auth().signInWithEmailLink(email, currentUrl)
					.then(result => resolve())
					.catch(error => {
						console.log(error);
						reject();
					});
			} else {
				reject();
			}
		});
	}

	function setEventEmailToLS(eventAlias, email) {
		const lsVals = {};
		lsVals[eventAlias] = {
			email: email
		}
		localStorage.setItem(localStorageKey, JSON.stringify(lsVals));
	}

	function getEventEmailFromLS(eventAlias) {
		const lsObj = window.localStorage.getItem(localStorageKey) || {};
		return JSON.parse(lsObj[eventAlias]) ? JSON.parse(lsObj[eventAlias]).email : null;
	}
	
	return {
		auth,
		registerPlayer,
		authorizePlayer
	};

};

const instance = authService();

export default instance;