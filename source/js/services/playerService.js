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
			const currentEventKey = await dbService.getCurrentEventId();
			if (!currentEventKey) {
				reject('The event code is invalid.')
			}
			auth.signInAnonymously()
				.then(user => createPlayer(playerVals, currentEventKey, user.uid))
				.then(user => resolve('User created!'))
				.catch(error => {
					console.log(error);
					reject('Something went wrong');
				});
		});
	}

	function createPlayer(playerVals, eventKey, uid) {
		const formattedPlayerVals = {
			firstName: playerVals.firstName,
			lastName: playerVals.lastName,
			email: playerVals.email,
			event: eventKey,
			active: true
		};
		return dbService.getDb().ref(`/players/${uid}`).update(formattedPlayerVals);
	}

	function authorize(eventAlias) {
		return new Promise(async(resolve, reject) => {
			const currentEventId = await dbService.getCurrentEventId();
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