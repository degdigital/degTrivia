import appConfig from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService.js';
import playerService from './services/playerService.js';
import registration from './screens/registration.js';
import gameLanding from './screens/gameLanding.js';

if (appConfig.element) {
	const registrationInst = registration(appConfig);
	const gameLandingInst = gameLanding(appConfig);
	const routes = {
		registration: registrationInst.renderRegistrationForm,
		password: registrationInst.renderPasswordForm,
		gameLanding: gameLandingInst.render
	};
	router.init(routes, appConfig);

	playerService.authorize()
		.then(() => router.route('gameLanding'))
		.catch(errors => {
			if (errors.mustReauthenticate === true) {
				router.route('password');
			} else {
				router.route('registration');
			}
		});
}
