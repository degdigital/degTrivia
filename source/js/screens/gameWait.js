import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';

const gameWait = function(element) {
    const threshold = 7200000;
    const nextGameTime = new Date('April 19, 2018 17:24:00');

	function init() {

    }
    
    function renderCountdownContainer(timeTilNextGame) {
        replaceContent(element, `
            <div class="countdown-container"></div>
        `);
        countdown(timeTilNextGame, 'milliseconds');
    }

    function renderNextGameText(nextGameTime) {
        replaceContent(element, `
            <div>
                Next game is <time datetime="${nextGameTime.toISOString()}">${nextGameTime.toString()}</time>
            </div>
        `);
    }

	function render() {
        //get time of next game from service
        const timeTilNextGame = nextGameTime.valueOf() - Date.now();
        if (timeTilNextGame < threshold) {
            renderCountdownContainer(timeTilNextGame)
        } else {
            renderNextGameText(nextGameTime);
        }
		
	}

	init();

	return {
		render
	};

};

export default gameWait;