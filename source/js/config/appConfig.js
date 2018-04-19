import {getUrlSegment} from '../utils/urlUtils.js';

const appConfig = {
	element: document.getElementById('app'),
	eventAlias: getUrlSegment(),
	routerLinkClass: 'js-router-link',
	routeAttr: 'data-route'
};

export default appConfig;