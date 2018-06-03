import { replaceContent } from '../utils/domUtils.js';

function renderEventHashtag(eventHashtag) {
	return eventHashtag ? `<div class="event-hashtag">${eventHashtag}</div>` : '';
}

function renderContents({eventHashtag}) {
	return `
		<img src="/images/deg-logo.svg" alt="DEG logo" class="logo" />
		${renderEventHashtag(eventHashtag)}`;
}

function render(containerEl, options) {
	const html = `
		<header role="banner" class="site-header" data-site-header>
			${renderContents(options)}
		</header>
	`;

	containerEl.insertAdjacentHTML('beforeend', html);

	return containerEl.querySelector('[data-site-header]');
}

function update(headerEl, options) {
	replaceContent(headerEl, renderContents(options)); 
}

export default function siteHeader(containerEl, options = {}) {
	const headerEl = render(containerEl, options);

	return {
		update: options => update(headerEl, options)
	};
}