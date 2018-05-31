export function renderHtmlAttrs(attrs) {
	return Object.keys(attrs)
		.map(attrName => `${attrName}="${attrs[attrName]}"`)
		.join(' ');
}