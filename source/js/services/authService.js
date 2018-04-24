import dbService from './dbService.js';
import firebase from '@firebase/app';
import '@firebase/auth';

const authService = function() {

	let auth = null;
	const currentUrl = window.location.href;
	const localStorageKey = 'degTriviaEmail';

	function init() {
		auth = firebase.auth();
	}

	function getAuth() {
		return auth;
	}

	async function registerPlayer(playerVals = {}) {
		return new Promise((resolve, reject) => {
			if (!playerVals.email || playerVals.email.length === 0) {
				reject('You must provide an email address');
			}
			dbService.createInactivePlayer(playerVals)
				.then(() => {
					getAuth().sendSignInLinkToEmail(playerVals.email, {
						url: `${currentUrl}?finishSignup=1`,
						handleCodeInApp: true
					})
						.then(() => {
							window.localStorage.setItem(localStorageKey, playerVals.email);
							resolve('Email sent!');
						})
						.catch(() => reject('Something went wrong'));
				});
		});
	}

	function authorizePlayer(eventAlias) {
		return new Promise((resolve, reject) => {
			auth.onAuthStateChanged(user => {
				if (user) {
					resolve();
				} else if (auth.isSignInWithEmailLink(currentUrl)) {
					const email = window.localStorage.getItem(localStorageKey);
					if (email) {
						auth.signInWithEmailLink(email, currentUrl)
					    	.then(result => {
					    		window.localStorage.removeItem(localStorageKey);
					    		history.replaceState(null, null, '/');
					    		resolve();
					    	})
					    	.catch(error => reject(error));
					} else {	
						reject({
							badEmailLink: true
						});
					}
				} else {
					reject({
						badEmailLink: false
					});
				}
			});
		});
	}
	
	return {
		init,
		getAuth,
		registerPlayer,
		authorizePlayer
	};

};

const instance = authService();

export default instance;