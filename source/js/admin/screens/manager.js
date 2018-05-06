// Utils
import {replaceContent} from '../../utils/domUtils';


// Plugins
import tabs from '../plugins/tabs.js';

// Components
import killSwitch from '../components/killSwitch.js';
import resetApp from '../components/resetApp.js';
import activeEvent from '../components/activeEvent.js';
import activeGame from '../components/activeGame.js';
import activeQuestion from '../components/activeQuestion.js';
import endGameInterface from '../components/endGameInterface.js';

const manager = function(el) {

	const killSwitchWrapperClass = 'killswitch-wrapper';
	const resetAppWrapperClass = 'resetapp-wrapper';
	const activeEventWrapperClass = 'activeevent-wrapper';
	const activeGameWrapperClass = 'activegame-wrapper';
	const activeQuestionWrapperClass = 'activequestion-wrapper';
	const endGameWrapperClass = 'endgame-wrapper';
	let activeGameInst;
	let activeQuestionInst;
	let endGameInterfaceInst;

	function render() {
		replaceContent(el, `
			<h1>Welcome, admin!</h1>
			<ul class="tab-triggers">
				<li><button class="tab-trigger" data-target="gameplay">Manage Gameplay</button></li>
				<li><button class="tab-trigger" data-target="setup">Setup</button></li>
				<li><button class="tab-trigger" data-target="yikes">Yikes</button></li>
			</ul>
			<div class="tab-section" data-section="gameplay">
				<div class="${activeEventWrapperClass}"></div>
				<div class="${activeGameWrapperClass}"></div>
				<div class="${activeQuestionWrapperClass}"></div>
				<div class="${endGameWrapperClass}"></div>
			</div>
			<div class="tab-section" data-section="setup">
				Setup
			</div>
			<div class="tab-section" data-section="yikes">
				<div class="${killSwitchWrapperClass}"></div>
				<hr>
				<div class="${resetAppWrapperClass}"></div>
			</div>
		`);
		tabs();
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
		renderEndGameInterface(activeGameId);	
	}

	function renderEndGameInterface(activeGameId) {
		if(activeGameId && activeGameId !== false) {
			const endGameWrapperEl = el.querySelector(`.${endGameWrapperClass}`);
			endGameInterfaceInst = endGameInterface(endGameWrapperEl, activeGameId);
			endGameInterfaceInst.render();
		} else if(endGameInterfaceInst) {
			endGameInterfaceInst.teardown();
		}
	}

	return {
		render
	};

};

export default manager;