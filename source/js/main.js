import appConfig from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService.js';
import gameLanding from './screens/gameLanding.js';

if (appConfig.element) {
	const gameLandingInst = gameLanding(appConfig);
	const routes = {
		gameLanding: gameLandingInst.render
	};

	router.init(routes, {
		routerLinkClass: appConfig.routerLinkClass,
		routeAttr: appConfig.routeAttr
	});
	eventsService.subscribe('onAuthStateChanged', user => router.route('gameLanding', {user}));
}
