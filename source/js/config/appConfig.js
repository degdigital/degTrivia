import {getUrlSegment} from '../utils/urlUtils.js';

const appConfig = {
	element: document.getElementById('app'),
	auth: firebase.auth(),
	db: firebase.database(),
	eventAlias: getUrlSegment(),
	routerLinkClass: 'js-router-link',
	routeAttr: 'data-route'
};

export default appConfig;