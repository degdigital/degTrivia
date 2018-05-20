const fetch = require('node-fetch');

module.exports = function(db, snapshot, context) {

    return new Promise((resolve, reject) => {

    	const requestTokenEndpoint = 'https://auth.exacttargetapis.com/v1/requestToken';
    	const sendDataEndpoint = 'https://www.exacttargetapis.com/hub/v1/dataevents/key:Event_Leads/rowset';
		const clientId = 'nou3f5ceywfqv8vveh58z323';
		const clientSecret = 'W25zroRP03Hv1I0fgac0DRs3';
		const sfmcRef = db.ref('sfmc');
		const rawPlayerVals = snapshot.val();

		function init() {
			getValidTokenVals()
				.then(validTokenObj => cacheTokenVals(validTokenObj))
				.then(tokenVals => submitPlayerVals(tokenVals.accessToken, rawPlayerVals))
				.then(response => {
					console.info(response);
					resolve(response);
				})
				.catch(error => {
					console.error(error);
					reject(error);
				});
		}

		function getValidTokenVals() {
			return new Promise((resolve, reject) => {
				getCachedTokenVals()
					.then(cachedTokenVals => {
						if (cachedTokenIsValid(cachedTokenVals)) {
							resolve({
								needsCaching: false,
								tokenVals: cachedTokenVals
							});
						} else {
							getNewTokenVals()
								.then(newTokenVals => resolve({
									needsCaching: true,
									tokenVals: newTokenVals
								}))
								.catch(error => reject(error));
						}
					})
					.catch(error => reject(error));
			});
		}

		function getCachedTokenVals() {
			return sfmcRef.once('value').then(snapshot => snapshot.val());
		}

		function getNewTokenVals() {
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
				.then(newTokenVals => {
					newTokenVals.expiresIn = newTokenVals.expiresIn * 1000;
					return newTokenVals;
				})
				.catch(error => error);
		}

		function cacheTokenVals(validTokenObj) {
			return new Promise((resolve, reject) => {
				const needsCaching = validTokenObj.needsCaching;
				const tokenVals = validTokenObj.tokenVals;
				if (needsCaching === false) {
					resolve(tokenVals);
				} else {
					const defaultVals = {
						timestamp: Date.now()
					};
					const combinedVals = Object.assign({}, defaultVals, tokenVals);
					sfmcRef.update(combinedVals, () => resolve(tokenVals));
				}
			});
		}	

		function submitPlayerVals(token, rawVals) {
			const formattedPlayerVals = formatPlayerVals(rawVals);
			return fetch(sendDataEndpoint, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				},
				body: JSON.stringify(formattedPlayerVals)
			});
		}

		function cachedTokenIsValid(cachedTokenVals) {
			return cachedTokenVals && 
				cachedTokenVals.accessToken && 
				cachedTokenVals.expiresIn && 
				cachedTokenVals.timestamp && 
				cachedTokenVals.expiresIn + cachedTokenVals.timestamp > Date.now() - 10000; // Subtract 10 seconds as a precaution
		}

		function formatPlayerVals(playerVals = {}) {
			return [
			    {
			        "keys": {
			            "Company Email": playerVals.companyEmail || null
			        },
			        "values": {
			            "First Name": playerVals.firstName || null,
			            "Name Name": playerVals.lastName || null,
			            "Company Name": playerVals.companyName || null,
			            "Phone Number": playerVals.phoneNumber || null,               
			            "Event ID": playerVals.eventId || null                     
			        }
			    }
			];
		}
    	
    	init();

    });
};