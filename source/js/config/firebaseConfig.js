let firebaseConfig;

if(ENVIRONMENT === 'production') {
	firebaseConfig = {
	    apiKey: "AIzaSyCxeWRQrGSC-Pd3BMFtJzJjSG2R-qQAM-Q",
	    authDomain: "degtrivia-production.firebaseapp.com",
	    databaseURL: "https://degtrivia-production.firebaseio.com",
	    projectId: "degtrivia-production",
	    storageBucket: "degtrivia-production.appspot.com",
	    messagingSenderId: "618766944067"
	};
} else if (ENVIRONMENT === 'staging') {
	firebaseConfig = {
	    apiKey: "AIzaSyBRR8kx4lRPDu0TMNLFpDKejgjJvuMOC3Y",
	    authDomain: "degtrivia-staging.firebaseapp.com",
	    databaseURL: "https://degtrivia-staging.firebaseio.com",
	    projectId: "degtrivia-staging",
	    storageBucket: "degtrivia-staging.appspot.com",
	    messagingSenderId: "323647555659"
	};
} else {
	firebaseConfig = {
		apiKey: "AIzaSyAZ5Ad3YFPCz2QKnMPtAl89tjplLQX6Lpw",
	    authDomain: "degtrivia-develop.firebaseapp.com",
	    databaseURL: "https://degtrivia-develop.firebaseio.com",
	    projectId: "degtrivia-develop",
	    storageBucket: "degtrivia-develop.appspot.com",
	    messagingSenderId: "369298224791"
	};
}

export default firebaseConfig;