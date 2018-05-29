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
			<div class="background__video-wrap">
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
			</div>
			<div class="game-begin__content">
				<div class="game-begin-heading">
					<img src="../../images/deg-logo.svg" alt="DEG logo" class="logo" />
					<h1 class="page-title page-title--centered">Let's Play!</h1>
					<p class="hashtag text--centered">${eventData.hashtag || ''}</p>
				</div>
				<p class="subheading text--centered">Answer all six questions (no stopping for wrong answers) as fast as you can. 10 seconds per question. Speed and accuracy wins. Here comes the first question.</p>
			</div>
		`);
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