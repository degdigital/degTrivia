import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';

const gameWait = function(element) {
    
    function renderCountdownContainer(nextGameTime) {
        const timeTilNextGame = nextGameTime.valueOf() - Date.now();
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

    function renderNoGameText() {
        replaceContent(element, `
            <div>There are no more games scheduled for your event.</div>
        `)
    }

	async function render() {
        const nextGameTime = await dbService.getNextGameTime();
        if (nextGameTime) {
            renderCountdownContainer(nextGameTime);
        } else {
            renderNoGameText();
        }		
	}

	return {
		render
	};

};

export default gameWait;