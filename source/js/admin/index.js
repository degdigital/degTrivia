// Firebase
import firebase from '@firebase/app';
import firebaseConfig from '../config/firebaseConfig.js';

// Services
import playerService from '../services/playerService.js';
import dbService from '../services/dbService.js';

// Screens
import LoginForm from './components/LoginForm.jsx';
import Manager from './components/Manager.jsx';

import React from 'react';
import ReactDOM from 'react-dom';

class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.init();
		this.state = {
			isAdmin: false,
			isLoading: true
		}
	}

	bindEvents(db) {
		playerService.getAuth().onAuthStateChanged(user => this.onAuthStateChange(user, db));
	}

	async onAuthStateChange(user, db) {
		if (user) {
			const isAdmin = await db.ref(`admins/${user.uid}`).once('value').then(snapshot => snapshot.exists() && snapshot.val() === true);
			this.setState({isAdmin, isLoading: false});
		} else {
			this.setState({isLoading: false});
		}
	}

	init() {
		firebase.initializeApp(firebaseConfig);
		dbService.init();
		playerService.init();

		this.bindEvents(dbService.getDb());
	}

	render() {
		const childEl = this.state.isAdmin ?
						<Manager /> :
						<LoginForm /> ;
		return <div>
			{ this.state.isLoading ?
				<h1>Loading...</h1> :
				childEl
			}
		</div>
	}
}

ReactDOM.render(
	<AdminApp />,
	document.getElementById('app')
)
