const router = function() {

	const errors = {
		noRoutesSet: 'No routes set',
		routeNotFound: 'Route not found'
	};
	const defaults = {
		routerLinkClass: 'js-router-link',
		routeAttr: 'data-route'
	};
	const stateObj = {};
	let routes;
	let settings;
	let currentRoute = null;

	function init(routesObj = null, options = {}) {
		if (routesObj === null) {
			console.log(errors.noRoutesSet);
		} else {
			routes = routesObj;
			settings = Object.assign({}, defaults, options);
			bindEvents();
		}
	}

	function bindEvents() {
		document.addEventListener('click', e => {
			const el = e.target;
			if (el.classList.contains(settings.routerLinkClass)) {
				e.preventDefault();
				const attr = el.nodeName === 'A' ? 'href' : settings.routeAttr;
				route(el.getAttribute(attr), {
					el: el,
					data: Object.assign({}, el.dataset)
				});
			}
		});
		window.addEventListener('popstate', e => {
			const path = e.state.path;
			if (path) {
				route(path);
			}
		});
	}

	function route(path = null, params = null, silent = true) {
		if (!routes[path]) {
			console.log(errors.routeNotFound);
		} else {
			if(currentRoute !== null && "teardown" in currentRoute) {
				currentRoute.teardown();
			}

			currentRoute = routes[path];

			currentRoute.render(params);
			stateObj.path = path; 
			if (silent === false) {
				history.pushState(stateObj, '', hyphenize(path));
			}
		}
	}

	function hyphenize(str = '') {
		return str.replace(/([a-z][A-Z])/g, g => `${g[0]}-${g[1].toLowerCase()}`);
	}

	return {
		init: init,
		route: route
	};

};

const instance = router();

export default instance;