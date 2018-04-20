import appConfig from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService.js';
import authService from './services/authService.js';
import registration from './screens/registration.js';

if (appConfig.element) {
	const registrationInst = registration(appConfig);
	const routes = {
		register: registrationInst.register,
		enterPassword: registrationInst.enterPassword
	};
	router.init(routes, {
		routerLinkClass: appConfig.routerLinkClass,
		routeAttr: appConfig.routeAttr
	});

	authService.authorizePlayer(appConfig.eventAlias)
		.then(() => console.log('authorized'))
		.catch(() => router.route('captureForm'));
	// eventsService.subscribe('onAuthStateChanged', user => router.route('gameLanding', {user}));
}
