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
				reject({
					prop: 'email',
					message: 'You must provide an email address.'
				});
			}
			const promises = await Promise.all([
				dbService.getActiveEventId(),
				dbService.getEvent(playerVals.eventAlias)
			]);
			const activeEventId = promises[0];
			const requestedRegistrationEvent = promises[1];
			if (!activeEventId || !requestedRegistrationEvent || activeEventId !== Object.keys(requestedRegistrationEvent)[0]) {
				reject({
					prop: 'eventAlias',
					message: 'The event code is invalid.'
				});
			} else {
				auth.signInAnonymously()
					.then(user => createPlayer(playerVals, activeEventId, user.uid))
					.then(user => resolve())
					.catch(error => {
						auth.signOut();
						console.log(error);
						reject({
							message: 'Something went wrong'
						});
					});
			}
			
		});
	}

	function createPlayer(playerVals, eventKey, uid) {
		const formattedPlayerVals = {
			firstName: playerVals.firstName,
			lastName: playerVals.lastName,
			companyName: playerVals.companyName,
			phoneNumber: formatPhoneNumber(playerVals.phoneNumber),
			email: playerVals.email,
			event: eventKey,
			active: true
		};
		return dbService.getDb().ref(`/players/${uid}`).update(formattedPlayerVals);
	}

	function formatPhoneNumber(str = '') {	
		const strWithSpecialCharsRemoved = str.replace(/\D/g, '');	
		if (strWithSpecialCharsRemoved.length === 10) {	
			return `1${strWithSpecialCharsRemoved}`;	
		} else {	
			return strWithSpecialCharsRemoved;	
		}	
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
		return dbService.getDb().ref('players').child(`${uid}`).once('value').then(snapshot => snapshot.val());
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