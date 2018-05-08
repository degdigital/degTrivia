function getAppConfig() {
	return {
		element: document.getElementById('app'),
		routerLinkClass: 'js-router-link',
		routeAttr: 'data-route'
	};
}

export { getAppConfig };