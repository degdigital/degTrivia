// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import gameService from '../services/gameService.js';

const buttonClass = 'between-questions-button';

function bindEvents(wrapperEl, boundClickHandler) {
	if (wrapperEl) {
		wrapperEl.addEventListener('click', boundClickHandler);
	}
}

function onWrapperClick(e, gameId) {
	const el = e.target;
	if (el.classList.contains(buttonClass)) {
		showInbetweenScreen(gameId);			
	}
}

function showInbetweenScreen(gameId) {
	gameService().showBetweenQuestionScreen(gameId)
		.catch(error => console.log(error));
}

function render(wrapperEl) {
	if (wrapperEl) {
		replaceContent(wrapperEl, `
			<button class="${buttonClass}" id="betweenQuestions" name="betweenQuestions">Host is talking</button>
		`);
	}
}

function teardown(boundClickHandler, wrapperEl) {
	if (wrapperEl) {
		wrapperEl.removeEventListener('click', boundClickHandler);
		replaceContent(wrapperEl, '');	
	}
}

function betweenQuestionInterface(wrapperEl, gameId) {
	const boundClickHandler = e => onWrapperClick(e, gameId);
	bindEvents(wrapperEl, boundClickHandler);

	return {
		render: () => render(wrapperEl),
		teardown: () => teardown(boundClickHandler, wrapperEl)
	};
}

export default betweenQuestionInterface;