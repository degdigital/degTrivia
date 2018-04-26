function getUrlSegment(index = 1) {
	const segments = window.location.pathname.split('/');
	return segments[index] ? segments[index] : null;
}

function getUrlParameter(name, queryString = window.location.search) {
	let match = RegExp('[?&]' + name + '=([^&]*)').exec(queryString);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export {
	getUrlSegment,
	getUrlParameter
};