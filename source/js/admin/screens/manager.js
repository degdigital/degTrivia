// Utils
import {replaceContent} from '../../utils/domUtils';

// Components
import killSwitch from '../components/killSwitch.js';
import resetApp from '../components/resetApp.js';
import activeEvent from '../components/activeEvent.js';
import activeGame from '../components/activeGame.js';
import activeQuestion from '../components/activeQuestion.js';

const manager = function(el) {

	const killSwitchWrapperClass = 'killswitch-wrapper';
	const resetAppWrapperClass = 'resetapp-wrapper';
	const activeEventWrapperClass = 'activeevent-wrapper';
	const activeGameWrapperClass = 'activegame-wrapper';
	const activeQuestionWrapperClass = 'activequestion-wrapper';
	let activeGameInst;
	let activeQuestionInst;

	function render() {
		replaceContent(el, `
			<h1>Welcome, admin!</h1>
			<div class="${activeEventWrapperClass}"></div>
			<div class="${activeGameWrapperClass}"></div>
			<div class="${activeQuestionWrapperClass}"></div>
			<hr>
			<div class="${killSwitchWrapperClass}"></div>
			<hr>
			<div class="${resetAppWrapperClass}"></div>
		`);
		killSwitch(el.querySelector(`.${killSwitchWrapperClass}`));
		resetApp(el.querySelector(`.${resetAppWrapperClass}`));
		activeEvent(el.querySelector(`.${activeEventWrapperClass}`), {
			onActiveEventChangeCallback: onActiveEventChange
		});
		activeGameInst = activeGame(el.querySelector(`.${activeGameWrapperClass}`), {
			onActiveGameChangeCallback: onActiveGameChange
		});
		activeQuestionInst = activeQuestion(el.querySelector(`.${activeQuestionWrapperClass}`));
	}

	function onActiveEventChange(activeEventId) {
		activeGameInst.render(activeEventId);
	}

	function onActiveGameChange(activeGameId) {
		activeQuestionInst.render(activeGameId);
	}

	return {
		render
	};

};

export default manager;