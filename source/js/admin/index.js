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
import {Provider, connect} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers/index.js';

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

		return (
			<div>
				<header role="banner" className="site-header">
					<img src="../../images/deg-logo.svg" alt="DEG logo" className="logo" />
					<h1 className="page-title">Trivia Admin</h1>
				</header>
				{ this.state.isLoading ?
					<h1>Loading...</h1> :
					childEl
				}
			</div>
		)
	}
}

const store = createStore(reducers, {}, applyMiddleware(reduxThunk, logger));

ReactDOM.render(
	<Provider store={store}>
		<AdminApp />
	</Provider>,
	document.getElementById('app')
)
