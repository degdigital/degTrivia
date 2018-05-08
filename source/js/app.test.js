import app from './app.js';
import {getAppConfig} from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService';

jest.mock('./utils/router');
jest.mock('./services/eventsService');

let appConfig;

beforeEach(() => {
	eventsService.__reset();

	const appEl = document.createElement('div');
	appEl.setAttribute('id', 'app');
	document.body.appendChild(appEl);

	appConfig = getAppConfig();
});

describe('app', () => {
	it('should route to registration page when user is unauthenticated', () => {
        const routeSpy = jest.spyOn(router, 'route'); 
        
        app(appConfig);

		eventsService.__fireEvent('onPlayerUnauthenticated');

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('registration');
    });

});