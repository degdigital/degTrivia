// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

// Plugins
import tabs from '../plugins/tabs.js';

// Components
import questionDuration from '../components/questionDuration.js';
import killSwitch from '../components/killSwitch.js';
import resetApp from '../components/resetApp.js';
import activeEvent from '../components/activeEvent.js';
import activeGame from '../components/activeGame.js';
import activeQuestion from '../components/activeQuestion.js';
import endGameInterface from '../components/endGameInterface.js';
import addEvent from '../components/addEvent.js';
import viewEvents from '../components/viewEvents.js';
import addGame from '../components/addGame.js';
import viewGames from '../components/viewGames.js';
import viewPlayers from '../components/viewPlayers.js';

const manager = function(el) {

	const questionDurationWrapperClass = 'questionduration-wrapper';
	const killSwitchWrapperClass = 'killswitch-wrapper';
	const resetAppWrapperClass = 'resetapp-wrapper';
	const activeEventWrapperClass = 'activeevent-wrapper';
	const activeGameWrapperClass = 'activegame-wrapper';
	const activeQuestionWrapperClass = 'activequestion-wrapper';
	const endGameWrapperClass = 'endgame-wrapper';
	const addEventWrapperClass = 'addevent-wrapper';
	const viewEventsWrapperClass = 'viewevents-wrapper';
	const addGameWrapperClass = 'addgame-wrapper';
	const viewGamesWrapperClass = 'viewgames-wrapper';
	const viewPlayersWrapperClass = 'viewplayers-wrapper';
	let activeGameInst;
	let activeQuestionInst;
	let endGameInterfaceInst;

	function render() {
		replaceContent(el, `
			<h1>Welcome, admin!</h1>
			<ul class="tab-triggers">
				<li><button class="tab-trigger" data-target="gameplay">Manage Gameplay</button></li>
				<li><button class="tab-trigger" data-target="events">Events</button></li>
				<li><button class="tab-trigger" data-target="games">Games</button></li>
				<li><button class="tab-trigger" data-target="players">Players</button></li>
				<li><button class="tab-trigger" data-target="system">System</button></li>
			</ul>
			<div class="tab-section" data-section="gameplay">
				<div class="${activeEventWrapperClass}"></div>
				<div class="${activeGameWrapperClass}"></div>
				<div class="${activeQuestionWrapperClass}"></div>
				<div class="${endGameWrapperClass}"></div>
			</div>
			<div class="tab-section" data-section="events">
				<div class="${addEventWrapperClass}"></div> 
				<div class="${viewEventsWrapperClass}"></div>
			</div>
			<div class="tab-section" data-section="games">
				<div class="${addGameWrapperClass}"></div> 
				<div class="${viewGamesWrapperClass}"></div> 
			</div>
			<div class="tab-section" data-section="players">
				<div class="${viewPlayersWrapperClass}"></div> 
			</div>
			<div class="tab-section" data-section="system">
				<div class="${questionDurationWrapperClass}"></div>
				<hr>
				<div class="${killSwitchWrapperClass}"></div>
				<hr>
				<div class="${resetAppWrapperClass}"></div>
			</div>
		`);
		initComponents();
	}

	async function initComponents() {
		const initialData = await dbService.getInitialData();
		tabs();
		questionDuration(el.querySelector(`.${questionDurationWrapperClass}`));
		killSwitch(el.querySelector(`.${killSwitchWrapperClass}`));
		resetApp(el.querySelector(`.${resetAppWrapperClass}`));
		activeEvent(el.querySelector(`.${activeEventWrapperClass}`), {
			onActiveEventChangeCallback: onActiveEventChange
		});
		activeGameInst = activeGame(el.querySelector(`.${activeGameWrapperClass}`), {
			onActiveGameChangeCallback: onActiveGameChange
		});
		activeQuestionInst = activeQuestion(el.querySelector(`.${activeQuestionWrapperClass}`));
		addEvent(el.querySelector(`.${addEventWrapperClass}`), initialData);
		viewEvents(el.querySelector(`.${viewEventsWrapperClass}`));
		addGame(el.querySelector(`.${addGameWrapperClass}`), initialData);
		viewGames(el.querySelector(`.${viewGamesWrapperClass}`));
		viewPlayers(el.querySelector(`.${viewPlayersWrapperClass}`));
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
			if (endGameInterfaceInst) {
				endGameInterfaceInst.teardown();
			}
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