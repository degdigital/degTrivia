import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';
import rotatingCopy from '../components/rotatingCopy.js';
import { format as formatDate, isSameDay, differenceInMilliseconds } from 'date-fns';

const countdownThreshold = 900000; //15 minutes in milliseconds

const pregameCountdown = function({element}) {
    let countdownInst;
    let rotatingCopyInst;

    function renderNoNextGameMessage() {
        replaceContent(element, `<p>No other games are currently scheduled.</p>`);
    }

    function renderCountdown(nextGameTime) {
        const timeTilNextGame = differenceInMilliseconds(nextGameTime, new Date());
        replaceContent(element, `
            <div class="countdown-container"></div>
            <div class="countdown-rotating-copy"></div>
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
                <div class="countdown-rotating-copy"></div>
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

    function startRotatingCopy(activeEventId) {
        if (!rotatingCopyInst) {
            const el = element.querySelector('.countdown-rotating-copy');
            if (el) {
                rotatingCopyInst = rotatingCopy(el);
            }
        }
        rotatingCopyInst.start({
            path: `events/${activeEventId}/pregameRotatingCopy`
        });
    }

	async function render() {
        const promises = await Promise.all([
            dbService.getNextGameTime(),
            dbService.getActiveEventId()
        ]);
        const nextGameTime = promises[0];
        const activeEventId = promises[1];
        if (nextGameTime) {
            if(isGameTimeWithinCountdownThreshold(nextGameTime)) {
                renderCountdown(nextGameTime);
                startRotatingCopy(activeEventId);
                
            } else if(hasGameTimePassed(nextGameTime)) {
                renderGameReadyMessage();
                rotatingCopyInst.teardown();
            } else {
                renderNextGameTimeMessage(nextGameTime);
                startRotatingCopy(activeEventId);
            }
        } else {
            renderNoNextGameMessage();
            rotatingCopyInst.teardown();
        }	
	}

	return {
        render,
        teardown: () => {
            if (countdownInst) {
                countdownInst.stop();
            }
            if (rotatingCopyInst) {
                rotatingCopyInst.teardown();
            }
        }
	};

};

export default pregameCountdown;