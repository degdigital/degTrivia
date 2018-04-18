function getUrlSegment(index = 1) {
	const segments = window.location.pathname.split('/');
	return segments[index] ? segments[index] : null;
}

export {
	getUrlSegment
};