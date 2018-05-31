import {replaceContent} from '../utils/domUtils.js';

const gameWaitBeforeQuestions = function(element) {

	const siteHeaderSelector = '[data-site-header]';
	const hiddenClass = 'is-hidden';

	function hideSiteHeader() {
		const siteHeaderEl = document.querySelector(siteHeaderSelector);
		if(siteHeaderEl) {
			siteHeaderEl.classList.add(hiddenClass);
		}
	}

	function render(eventData) {
		hideSiteHeader();
		replaceContent(element, `
			<video class="background__video" 
				autoplay 
				loop 
				muted
				playsinline
				preload="auto" 
				poster="../../images/App-Hex-Ani-Congratulations.jpg"
				type="video/mp4"
			>
				<source src="../../images/App-Hex-Ani-375.mp4" type="video/mp4">
			</video>
			<div class="game-begin__content">
				<div class="game-begin-heading">
					<img src="../../images/deg-logo.svg" alt="DEG logo" class="logo" />
					${renderTitle(eventData.gameWaitBeforeQuestionsCopy.title)}
					${renderHashtag(eventData.hashtag)}
				</div>
				${renderDescription(eventData.gameWaitBeforeQuestionsCopy.description)}
			</div>
		`);
	}

	function renderTitle(title = null) {
		if (!title) {
			return '';
		}
		return `
			<h1 class="page-title page-title--centered">${title}</h1>
		`;
	}

	function renderHashtag(hashtag = null) {
		if (!hashtag) {
			return '';
		}
		return `
			<p class="hashtag text--centered">${hashtag}</p>
		`;
	}

	function renderDescription(description = null) {
		if (!description) {
			return '';
		}
		return `
			<p class="subheading text--centered">${description}</p>
		`;
	}

	function teardown() {
		const siteHeaderEl = document.querySelector(siteHeaderSelector);
		if(siteHeaderEl) {
			siteHeaderEl.classList.remove(hiddenClass);
		}
	}

	return {
		render,
		teardown
	};

};

export default gameWaitBeforeQuestions;