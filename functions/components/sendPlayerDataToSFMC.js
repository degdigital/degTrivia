const fetch = require('node-fetch');

module.exports = function(db, snapshot, context) {

    return new Promise((resolve, reject) => {

    	// const requestTokenEndpoint = 'https://auth.exacttargetapis.com/v1/requestToken';
    	const requestTokenEndpoint = 'https://auth-test.exacttargetapis.com/v1/requestToken';
    	const sendDataEndpoint = 'https://www.exacttargetapis.com/hub/v1/dataevents/key:Event_Leads/rowset';
		const clientId = 'nou3f5ceywfqv8vveh58z323';
		const clientSecret = 'W25zroRP03Hv1I0fgac0DRs3';

		function init() {
			const formattedPlayerVals = filterPlayerVals(snapshot.val());
			getValidToken()
				.then(validTokenVals => cacheToken(validTokenVals))
				.then(token => submitPlayerVals(token))
				.then(success => onSubmitSuccess(success))
				.catch(error => onSubmitError(error));
		}

		function getValidToken() {
			return new Promise((resolve, reject) => {
				getCachedTokenVals()
					.then(cachedTokenVals => {
						if (cachedTokenIsValid(cachedTokenVals)) {
							resolve({
								cachedTokenIsValid: true,
								tokenVals: cachedTokenVals
							});
						} else {
							getNewToken()
								.then(newTokenVals => resolve(newTokenVals));
						}
					})
					.catch(error => Promise.reject(error));
			});
		}

		function getCachedTokenVals() {
			return db.ref('sfmc').once('value').then(snapshot => snapshot.val());
		}

		function getNewToken() {
			return fetch(requestTokenEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					clientId: clientId,
					clientSecret: clientSecret
				})
			})
				.then(response => response.json())
				.then(json => ({
					cachedTokenIsValid: false,
					tokenVals: json
				}))
				.catch(error => {
					console.log(error);
					return error;
				})
		}

		function submitPlayerVals(token) {
			return Promise.resolve('submitPlayerVals success');
		}
		// 	return fetch(requestTokenEndpoint, {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify({
		// 			clientId: clientId,
		// 			clientSecret: clientSecret
		// 		})
		// 	})
		// 		.then(response => response.json())
		// 		.then(data => {
		// 			console.log('data');
		// 			console.log(data);
		// 			resolve(data);
		// 		})
		// 		.catch(error => {
		// 			console.log('error');
		// 			console.log(error);
		// 			reject(error);
		// 		});
		// }

		function cacheToken(tokenVals) {
			if (tokenVals.cachedTokenIsValid === false) {
				return db.ref('sfmc').update({
					accessToken: tokenVals.accessToken,
					expires: Date.now + (tokenVals.expiresIn * 1000)
				}, () => Promise.resolve(tokenVals.accessToken));
			} else {
				return Promise.resolve(tokenVals.accessToken);
			}
		}

		function onSubmitSuccess(success) {
			resolve(success);
		}

		function onSubmitError(error) {
			resolve(error);
		}

		function cachedTokenIsValid(cachedTokenVals) {
			return 
				cachedTokenVals &&
				cacheTokenVals.accessToken && 
				cacheTokenVals.expires &&
				cachedTokenVals.expires > Date.now() - 10000; // Subtract 10 seconds as a precaution
		}

		function filterPlayerVals(playerVals = {}) {
			return {
				companyEmail: playerVals.companyEmail || null,
				companyName: playerVals.companyName || null,
				eventId: playerVals.eventId || null,
				firstName: playerVals.firstName || null,
				lastName: playerVals.lastName || null,
				phoneNumber: playerVals.phoneNumber || null
			};
		}
    	
    	init();

    });
};