import firebase from '@firebase/app';
import '@firebase/auth';
import dbService from './dbService.js';
import {getUrlParameter} from '../utils/urlUtils.js';

const playerService = function() {

	let auth = null;

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
			const promises = await Promise.all([
				dbService.getActiveEventId(),
				dbService.getEvent(playerVals.eventAlias)
			]);
			const activeEventId = promises[0];
			const requestedRegistrationEvent = promises[1];
			if (!activeEventId || !requestedRegistrationEvent || activeEventId !== Object.keys(requestedRegistrationEvent)[0]) {
				reject('The event code is invalid.');
			} else {
				auth.signInAnonymously()
					.then(user => createPlayer(playerVals, activeEventId, user.uid))
					.then(user => resolve('User created!'))
					.catch(error => {
						auth.signOut();
						console.log(error);
						reject('Something went wrong');
					});
			}
			
		});
	}

	function createPlayer(playerVals, eventKey, uid) {
		const formattedPlayerVals = {
			firstName: playerVals.firstName,
			lastName: playerVals.lastName,
			companyName: playerVals.companyName,
			phoneNumber: playerVals.phoneNumber,
			email: playerVals.email,
			event: eventKey,
			active: true
		};
		return dbService.getDb().ref(`/players/${uid}`).update(formattedPlayerVals);
	}

	function authorize(eventAlias) {
		return new Promise(async(resolve, reject) => {
			auth.onAuthStateChanged(async(user) => {
				if (user) {
					console.log(user);
				} else {
					console.log('no user')

				}
			});
		});
	}

	function getCurrentPlayerInfo(uid) {
		if (cachedPlayerInfo) {
			return Promise.resolve(cachedPlayerInfo);
		}
		return dbService.getDb().ref('players').child(`${uid}`).once('value').then(snapshot => {
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