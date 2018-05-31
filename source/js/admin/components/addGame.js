// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

// Plugins
import questionManager from '../plugins/questionManager.js'

const addGame = function(wrapperEl, initialData) {

	const gamesRef = dbService.getDb().ref('games');
	const eventsRef = dbService.getDb().ref('events');
	const formClass = 'addgame-form';
	const questionsWrapperClass = 'questions-wrapper';
	let questionManagerInst;
	let formEl;

	function init() {
		bindEvents();
		render(initialData);
		questionManagerInst = questionManager(wrapperEl, {
			onSaveCallback: onQuestionSave
		});
	}

	function bindEvents() {
		wrapperEl.addEventListener('submit', onSubmit);
	}

	function onQuestionSave(questionsData) {
		// console.log(questionsData);
	}

	async function onSubmit(e) {
		e.preventDefault();
		const gameVals = formMapper.getValues(formEl);
		const questionsVals = getQuestionsVals();
		saveFormData(gameVals, questionsVals);
	}

	async function saveFormData(gameVals, questionsVals) {
		const newKey = gamesRef.push().key;
		const eventId = gameVals.event;
		gamesRef.child(newKey).update({
			activeQuestionId: false,
			event: eventId,
			name: gameVals.name,
			questions: questionsVals,
			showGameOver: false,
			showGameResults: false,
			showQuestionResults: false,
			startTime: new Date(gameVals.startTime).getTime()
		});
		eventsRef.child(`${eventId}/games`).update({
			[newKey]: true
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
						<input class="input--wide" id="name" name="name" type="text" required>
					</div>
					${renderDropdownSection('Event', data.events)}
					<div class="field">
						Questions
						<div class="${questionsWrapperClass}"></div>
					</div>
					<div class="field">
						<label for="startTime">Start Time</label><br>
						<input id="startTime" name="startTime" type="datetime-local" required>
					</div>
					<button type="submit">Add Game</button>
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
			<option value="${key}">${initialData.events[key].name}</option>
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

	function getQuestionsVals() {
		const rawQuestionsArr = questionManagerInst.getQuestionVals();
		if (rawQuestionsArr.length === 0) {
			return false;
		}
		let formattedQuestionsObj = {};
		rawQuestionsArr.forEach((item, index) => {
			const key = getKey();
			const choicesVals = getChoicesVals(item.choices);
			const correctChoice = Object.keys(choicesVals)[parseInt(item.correctChoice)];
			formattedQuestionsObj[key] = {
				question: item.question,
				choices: choicesVals,
				order: index,
				correctChoice: correctChoice
			};
		});
		return formattedQuestionsObj;

	}

	function getChoicesVals(choicesArr) {
		let formattedChoicesObj = {};
		choicesArr.forEach(choice => {
			const key = getKey();
			formattedChoicesObj[key] = {
				chosenCount: 0,
				text: choice
			};
		});
		return formattedChoicesObj;
	}


	function getKey() {
		return gamesRef.push().key;
	}

	init();

};

export default addGame;