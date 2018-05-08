// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

// Plugins
import questionManager from '../plugins/questionManager.js'

const addGame = function(wrapperEl, initialData) {

	let questionManagerInst;
	const gamesRef = dbService.getDb().ref('games');

	const formClass = 'addgame-form';
	const questionsWrapperClass = 'questions-wrapper';
	let formEl;

	function init() {
		bindEvents();
		render(initialData);
		questionManagerInst = questionManager(wrapperEl);
	}

	function bindEvents() {
		wrapperEl.addEventListener('submit', onSubmit);
	}

	function onSubmit(e) {
		e.preventDefault();
		const formVals = formMapper.getValues(formEl);
		saveFormData(formVals);
	}

	async function saveFormData(data) {
		const newKey = gamesRef.push().key;
		gamesRef.child(newKey).update({
			activeQuestionId: false,
			event: data.events,
			name: data.name,
			questions: false,
			series: data.series,
			showGameOver: false,
			showGameResults: false,
			showQuestionResults: false,
			startTime: new Date(data.startTime).getTime()
		});
	}

	function formatArrayToObject(arr = null) {
		if (!arr) {
			return null;
		}
		let output = {};
		arr.map(item => output[item] = true);
		return output;
	}

	function render(data) {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
				<fieldset>
					<legend>Add a Game</legend>
					<div class="field">
						<label for="name">Name</label><br>
						<input id="name" name="name" type="text" required>
					</div>
					${renderDropdownSection('Event', data.events)}
					${renderDropdownSection('Series', data.series)}
					<div class="field">
						Questions
						<div class="${questionsWrapperClass}"></div>
					</div>
					<div class="field">
						<label for="startTime">Start Time</label><br>
						<input id="startTime" name="startTime" type="datetime-local" required>
					</div>
					<button type="submit">Submit</button>
				</fieldset>
			</form>
		`);
		formEl = wrapperEl.querySelector(`.${formClass}`);
	}

	function renderDropdownSection(sectionName, sectionData) {
		if (!sectionData) {
			return '';
		}
		const lcName = sectionName.toLowerCase();
		const options = Object.keys(sectionData).reduce((output, key) => `
			${output}
			<option value="${key}">${key}</option>
		`, '');
		return `
			<div class="field">
				<label for="${lcName}">${sectionName}</label><br>
				<select id="${lcName}" name="${lcName}" required>
					${options}
				</select>
			</div>
		`;
	}

	init();

};

export default addGame;