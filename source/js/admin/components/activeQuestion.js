// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const activeQuestion = function(wrapperEl, options ={}) {

	const db = dbService.getDb();
	const triggerClass = 'activequestion-trigger';
	const defaults = {
		onActiveQuestionChangeCallback: null
	};
	let settings = Object.assign({}, defaults, options);
	let activeGameId;

	function bindEvents() {
		wrapperEl.addEventListener('change', onWrapperChange);
	}

	function onWrapperChange(e) {
		const el = e.target;
		if (el.classList.contains(triggerClass)) {
			const activeQuestionId = el.value === 'no-value' ? false : el.value;
			dbService.setActiveQuestion(activeGameId, activeQuestionId);
		}
	}

	async function render(gameId) {
		if (activeGameId && !gameId) {
			db.ref(`games/${activeGameId}`).update({
				activeQuestionId: false,
				showQuestionResults: false
			});
		}
		activeGameId = gameId;
		const responses = await Promise.all([
			db.ref(`games/${activeGameId}/activeQuestionId`).once('value').then(snapshot => snapshot.val()),
			db.ref(`games/${activeGameId}/questions`).once('value').then(snapshot => snapshot.val())
		]);
		const activeQuestionId = responses[0];
		const questions = responses[1];
		let content = '';
		if (questions) {
			content = `
				<label for="activeQuestion">Active Question:</label>
				<select class="${triggerClass}" id="activeQuestion" name="activeQuestion">
					${renderDropdownOptions(questions, activeQuestionId)}
				</select>
			`;
		}
		replaceContent(wrapperEl, content);
	}

	function renderDropdownOptions(questions, activeQuestionId) {
		return Object.keys(questions).reduce((output, id) => {
			return `
				${output}
				<option value="${id}" ${activeQuestionId === id ? 'selected' : ''}>${questions[id].question}</option>
			`;
		}, '<option value="no-value">No active question</option>');
	}

	bindEvents();

	return {
		render
	};
	
};

export default activeQuestion;