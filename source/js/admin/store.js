import dbService from '../services/dbService.js';

export const activeEventChanged = 'activeEventChanged';
export const activeGameChanged = 'activeGameChanged';

const initialState = {
	activeEventId: null,
	activeGameId: null
};

function store() {
	const subscribers = {};

	let state;

	function init() {
		const db = dbService.getDb();

		state = { ...initialState };

		db.ref('currentEvent')
			.on('value', snapshot => onEventChanged(snapshot.val()));
	}

	function onEventChanged(newEventId) {
		if(state.activeEventId !== null) {
			dbService.getDb().ref(`events/${state.activeEventId}/activeGameId`).off('value', onActiveGameChanged);
		}

		if(newEventId !== false) {
			dbService.getDb().ref(`events/${newEventId}/activeGameId`).on('value', onActiveGameChanged);
		} 

		state = {...state, activeEventId: newEventId === false ? null : newEventId };
		
		callSubscribersForEventType(activeEventChanged);
	}

	function onActiveGameChanged(snapshot) {
		const newGameId = snapshot.val();

		state = {...state, activeGameId: newGameId === false ? null : newGameId };

		callSubscribersForEventType(activeGameChanged);
	}

	function subscribe(eventType, callback) {
		if (typeof subscribers[eventType] === "undefined"){
	        subscribers[eventType] = [];
	    }

	    subscribers[eventType].push(callback);
	}

	function callSubscribersForEventType(eventType) {
		if (typeof subscribers[eventType] !== "undefined"){
			subscribers[eventType].forEach(subscriber => subscriber(state));
		}
	}

	return {
		init,
		subscribe
	}
}

export default store();