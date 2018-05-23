import app from './app.js';
import {getAppConfig} from './config/appConfig.js';
import router from './utils/router.js';
import eventsService from './services/eventsService';

jest.mock('./utils/router');
jest.mock('./services/eventsService');
jest.mock('classnames');

let appConfig;

beforeAll(() => {
	const appEl = document.createElement('div');
	appEl.setAttribute('id', 'app');
	document.body.appendChild(appEl);

	appConfig = getAppConfig();

	app(appConfig);
});

describe('app should route to', () => {
	let routeSpy;

	beforeAll(() => {
		routeSpy = jest.spyOn(router, 'route');
	});

	beforeEach(() => {
		jest.clearAllMocks(); 
	});


	test('registration page when user is unauthenticated', () => {
		eventsService.__fireEvent('onPlayerUnauthenticated');

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('registration');
    });

    test('info page when there is no active event', () => {
    	const dataObj = {}; 
    	eventsService.__fireEvent('onNoActiveEvent', dataObj);

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('info', dataObj);
    });

    test('pregame countdown page when there is an active event', () => {
		eventsService.__fireEvent('onGameCountdown');

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('pregameCountdown');
    });

    test('game wait page when a game starts', () => {
    	const dataObj = {}; 
		eventsService.__fireEvent('onGameStart', dataObj);

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('gameWaitBeforeQuestions', dataObj);
    });

    test('question page when a question starts', () => {
    	const dataObj = {}; 
		eventsService.__fireEvent('onQuestionAsked', dataObj);

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('gameQuestion', dataObj);
    });

    test('question results page when a question ends', () => {
    	const dataObj = {}; 
		eventsService.__fireEvent('onQuestionResults', dataObj);

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('gameQuestionResults', dataObj);
    });

    test('game results page when game results are ready', () => {
        const dataObj = {}; 
        eventsService.__fireEvent('onPostgameResults', dataObj);

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('postgameResults', dataObj);
    });

    test('error page when an error occurs', () => {
		eventsService.__fireEvent('onError');

        expect(routeSpy).toHaveBeenCalledTimes(1);
        expect(routeSpy).toHaveBeenCalledWith('error');
    });
});