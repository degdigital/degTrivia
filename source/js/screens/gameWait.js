import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';

const gameWait = function(element) {
    const threshold = 7200000;
    const nextGameTime = new Date('April 20, 2018 12:24:00');
    
    function renderCountdownContainer(timeTilNextGame) {
        replaceContent(element, `
            ${renderNextGameText(nextGameTime)}
            <div class="countdown-container"></div>
        `);
        countdown(timeTilNextGame, 'milliseconds');
    }

    function renderNextGameText(nextGameTime) {
        return `
            <div>
                Next game is 
                <time datetime="${nextGameTime.toISOString()}">
                    ${nextGameTime.toLocaleDateString()} ${nextGameTime.toLocaleTimeString()}
                </time>
            </div>
        `;
    }

	function render() {
        //get time of next game from service
        const timeTilNextGame = nextGameTime.valueOf() - Date.now();
        if (timeTilNextGame < threshold) {
            renderCountdownContainer(timeTilNextGame)
        } else {
            replaceContent(element, renderNextGameText(nextGameTime));
        }
		
	}

	return {
		render
	};

};

export default gameWait;