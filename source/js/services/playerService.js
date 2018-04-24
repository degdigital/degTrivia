import firebase from '@firebase/app';
import '@firebase/auth';
import dbService from './dbService.js';
import {getUrlParameter} from '../utils/urlUtils.js';

const playerService = function() {

	let auth = null;
	const currentUrl = window.location.href;
	const pendingKeyUrlParam = 'k';
	let cachedPlayerInfo = null;

	function init() {
		auth = firebase.auth(); 
	}

	function getAuth() {
		return auth;
	}

	function register(playerVals = {}) {
		return new Promise(async(resolve, reject) => {
			if (!playerVals.email || playerVals.email.length === 0) {
				reject('You must provide an email address.');
			}
			const event = await dbService.getEvent(playerVals.eventAlias);
			if (!event) {
				reject('The event code you entered is invalid.')
			}
			const eventKey = Object.keys(event)[0];
			const pendingPlayerKey = await dbService.createPendingPlayer(playerVals, eventKey);
			auth.sendSignInLinkToEmail(playerVals.email, {
					url: `${currentUrl}?finishSignUp=1&${pendingKeyUrlParam}=${pendingPlayerKey}`,
					handleCodeInApp: true
				})
					.then(() => resolve('Email sent!'))
					.catch(() => reject('Something went wrong'));
		});
	}

	function authorize(eventAlias) {
		return new Promise(async(resolve, reject) => {
			const currentEventId = await dbService.getCurrentEventId();
			auth.onAuthStateChanged(async(user) => {
				if (user) {
					const currentPlayerInfo = await getCurrentPlayerInfo(user.uid);
					if (currentPlayerInfo.events[currentEventId]) {
						resolve();
					} else {
						reject({
							mustReauthenticate: true
						})
					}
				} else if (auth.isSignInWithEmailLink(currentUrl)) {
					const pendingKey = getUrlParameter(pendingKeyUrlParam);
					const email = await dbService.getPendingPlayer(pendingKey, 'email');
					if (email) {
						auth.signInWithEmailLink(email, currentUrl)
					    	.then(result => {
					    		dbService.createActivePlayer(result.user, pendingKey)
					    			.then(() => {
					    				history.replaceState(null, null, '/');
					    				resolve();
					    			})
					    		
					    	})
					    	.catch(error => reject(error));
					} else {	
						reject({
							mustReauthenticate: false
						});
					}
				} else {
					reject({
						mustReauthenticate: false
					});
				}
			});
		});
	}

	function getCurrentPlayerInfo(uid) {
		if (cachedPlayerInfo) {
			return Promise.resolve(cachedPlayerInfo);
		}
		return dbService.getDb().ref('activePlayers').child(`${uid}`).once('value').then(snapshot => {
			cachedPlayerInfo = snapshot.val();
			return cachedPlayerInfo;
		});
	}
	
	return {
		init,
		getAuth,
		register,
		authorize,
		getCurrentPlayerInfo
	};

};

const instance = playerService();

export default instance;