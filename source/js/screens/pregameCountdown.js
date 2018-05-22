import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';
import { format as formatDate, isSameDay, differenceInMilliseconds } from 'date-fns';

const countdownThreshold = 900000; //15 minutes in milliseconds

const pregameCountdown = function(element) {
    let countdownInst;

    function renderNoNextGameMessage() {
        replaceContent(element, `<p>No other games are currently scheduled.</p>`);
    }

    function renderCountdown(nextGameTime) {
        const timeTilNextGame = differenceInMilliseconds(nextGameTime, new Date());
        replaceContent(element, `
            <div class="countdown-container"></div>
        `);
        const containerElement = document.querySelector('.countdown-container');
        countdownInst = countdown({
            containerElement, 
            format: 'mm:ss',
            onComplete: onCountdownComplete
        });
        countdownInst.start(timeTilNextGame, 'milliseconds');
    }

    function onCountdownComplete() {
        renderGameReadyMessage();
    }

    function renderNextGameTimeMessage(nextGameTime) {
        let timeText = formatDate(nextGameTime, 'h:mma'); 
        if(!isSameDay(nextGameTime, new Date())) {
            timeText = `${timeText} on ${formatDate(nextGameTime, 'dddd, MMMM do')}`;
        }

        replaceContent(element, 
            `<div>
                Next game starts at 
                <time datetime="${nextGameTime.toISOString()}">
                    ${timeText} 
                </time>
            </div>`);
    }

    function renderGameReadyMessage() {
        replaceContent(element, `<p>The next game will be starting momentarily.</p>`);
    }

    function isGameTimeWithinCountdownThreshold(date) {
        const difference = differenceInMilliseconds(date, new Date());
        return (difference <= countdownThreshold && difference >= 0); 
    }

    function hasGameTimePassed(date) {
        const difference = differenceInMilliseconds(date, new Date());
        return difference < 0;
    }

	async function render() {
        const nextGameTime = await dbService.getNextGameTime();
        if (nextGameTime) {
            if(isGameTimeWithinCountdownThreshold(nextGameTime)) {
                renderCountdown(nextGameTime);
            } else if(hasGameTimePassed(nextGameTime)) {
                renderGameReadyMessage();
            } else {
                renderNextGameTimeMessage(nextGameTime);
            }
        } else {
            renderNoNextGameMessage();
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

export default pregameCountdown;