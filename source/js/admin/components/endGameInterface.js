// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import gameService from '../services/gameService.js';

const buttonClass = 'endgame-button';

function bindEvents(wrapperEl, boundClickHandler) {
	wrapperEl.addEventListener('click', boundClickHandler);
}

function onWrapperClick(e, gameId) {
	const el = e.target;
	if (el.classList.contains(buttonClass) && confirm('Are you sure?')) {
		endGame(gameId);			
	}
}

function endGame(gameId) {
	gameService().endGame(gameId)
		.catch(error => console.log(error));
}

function render(wrapperEl) {
	replaceContent(wrapperEl, `
		<button class="${buttonClass}" id="endGame" name="endGame">End Game</button>
	`);
}

function teardown(boundClickHandler, wrapperEl) {
	if (wrapperEl) {
		wrapperEl.removeEventListener('click', boundClickHandler);
		replaceContent(wrapperEl, '');	
	}
}

function endGameInterface(wrapperEl, gameId) {
	const boundClickHandler = e => onWrapperClick(e, gameId);
	bindEvents(wrapperEl, boundClickHandler);

	return {
		render: gameId => render(wrapperEl),
		teardown: () => teardown(boundClickHandler, wrapperEl)
	};
}

export default endGameInterface;