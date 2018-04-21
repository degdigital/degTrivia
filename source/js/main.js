import appConfig from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService.js';
import authService from './services/authService.js';
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

	authService.authorizePlayer()
		.then(() => router.route('gameLanding'))
		.catch(errors => {
			if (errors.badEmailLink === true) {
				router.route('password');
			} else {
				router.route('registration');
			}
		});
}
