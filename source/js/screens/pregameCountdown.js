import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';

const gameWait = function({element}) {
    let countdownInst;

    function renderCountdownContainer(nextGameTime) {
        const timeTilNextGame = nextGameTime.valueOf() - Date.now();
        replaceContent(element, `
            ${renderNextGameText(nextGameTime)}
            <div class="countdown-container"></div>
        `);
        const containerElement = document.querySelector('.countdown-container');
        countdownInst = countdown({containerElement, includeLabels: true, precision: 'day'});
        countdownInst.start(timeTilNextGame, 'milliseconds');
    }

    function renderNextGameText(nextGameTime) {
        return `
            <div class="next-game-time">
                Next game is 
                <time datetime="${nextGameTime.toISOString()}">
                    ${nextGameTime.toLocaleDateString()} ${nextGameTime.toLocaleTimeString()}
                </time>
            </div>
        `;
    }

	async function render() {
        const nextGameTime = await dbService.getNextGameTime();
        if (nextGameTime) {
            renderCountdownContainer(nextGameTime);
        }	
	}

	return {
        render,
        teardown: () => {
            if (countdownInst) {
                countdownInst.stop();
            }
        }
	};

};

export default gameWait;