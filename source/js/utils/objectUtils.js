function ensureArray(obj) {
	if (Array.isArray(obj) === false) {
		return [obj];
	}
	return obj;
}

function renderObjKeysToList(obj) {
	if (!obj) {
		return '';
	}
	const listItems = Object.keys(obj).reduce((output, key) => `
		${output}
		<li>${key}</li>
	`, '');
	return `
		<ul>
			${listItems}
		</ul>
	`;
}

function formatArrayToObject(arr = null) {
	if (!arr) {
		return null;
	}
	let output = {};
	arr.map(item => output[item] = true);
	return output;
}

export {
	ensureArray,
	renderObjKeysToList,
	formatArrayToObject
};