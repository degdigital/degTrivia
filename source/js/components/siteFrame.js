import siteHeader from './siteHeader.js';

function render(containerEl, options) {
	const siteHeaderInst = siteHeader(containerEl, options);

	const mainHtml = `<main class="main" data-main></main>`;
	containerEl.insertAdjacentHTML('beforeend', mainHtml);

	const mainEl = containerEl.querySelector('[data-main]');

	return {
		siteHeaderInst, 
		mainEl
	};
}

function update(siteHeaderInst, options) {
	siteHeaderInst.update(options);
}

export default function siteFrame(containerEl, options = {}) {
	const components = render(containerEl, options);

	return {
		getMainEl: () => components.mainEl,
		update: options => update(components.siteHeaderInst, options)
	};
}