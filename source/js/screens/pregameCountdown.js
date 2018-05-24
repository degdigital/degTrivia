import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';
import rotatingCopy from '../components/rotatingCopy.js';
import { format as formatDate, isSameDay, differenceInMilliseconds } from 'date-fns';

const countdownThreshold = 900000; //15 minutes in milliseconds
const countdownDataAttr = 'data-countdown';

const pregameCountdown = function(element) {
    let countdownInst;
    let rotatingCopyInst;

    function renderNoNextGameMessage() {
        return `<p>No other games are currently scheduled.</p>`;
    }

    function renderCountdown() {
        return `<div class="countdown next-game__time" ${countdownDataAttr}></div>`;
    }

    function renderNextGameTime(nextGameTime) {
        const timeText = formatDate(nextGameTime, 'h:mma'); 
        return `<time datetime="${nextGameTime.toISOString()}" class="next-game__time">
                ${timeText}
            </time>`;
    }

    function renderNextGameTimeIntro(showCountdown) {
        let introHtml = 'Next Game';
        if(showCountdown) {
            introHtml += '<br />Begins In';
        }
        return introHtml;
    }

    function renderNextGame(nextGameTime, showCountdown) {
        return `
            <div class="next-game">
                <div class="next-game__primary">
                    <img src="/images/clock.svg" alt="Clock" class="next-game__clock-image" />
                    <h1 class="next-game__title">
                        <div class="next-game__title-intro">${renderNextGameTimeIntro(showCountdown)}</div>
                        ${showCountdown ? renderCountdown() : renderNextGameTime(nextGameTime)}
                    </h1>
                    <div class="event-hashtag next-game__event-hashtag">#CNXTRIVIA</div>
                </div>
                <p class="next-game__message countdown-rotating-copy"></p>
            </div>
        `;
    }

    function startCountdown(countdownEl, nextGameTime) {
        const timeTilNextGame = differenceInMilliseconds(nextGameTime, new Date());
       
        countdownInst = countdown({
            containerElement: countdownEl, 
            format: 'mm:ss',
            onComplete: onCountdownComplete
        });
        countdownInst.start(timeTilNextGame, 'milliseconds');
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

    function stopRotatingCopy() {
        if (rotatingCopyInst) {
            rotatingCopyInst.teardown();
        }
    }

    function onCountdownComplete() {
        //Not sure if we still need to do anything here
    }

    function isGameTimeWithinCountdownThreshold(date) {
        const difference = differenceInMilliseconds(date, new Date());
        return (difference <= countdownThreshold && difference >= 0); 
    }

    async function renderContent() {
        const nextGameTime = await dbService.getNextGameTime();
        if (nextGameTime) {
            const showCountdown = isGameTimeWithinCountdownThreshold(nextGameTime);

            return renderNextGame(nextGameTime, showCountdown);
        } 
        
        return renderNoNextGameMessage();
    }

	async function render() {
        const promises = await Promise.all([
            dbService.getNextGameTime(),
            dbService.getActiveEventId()
        ]);
        const nextGameTime = promises[0];
        const activeEventId = promises[1];
        const showCountdown = nextGameTime ? 
            isGameTimeWithinCountdownThreshold(nextGameTime) :
            false;

        const contentHtml = nextGameTime ?
            renderNextGame(nextGameTime, showCountdown) :
            renderNoNextGameMessage()

        const html = `
            <div class="pregame">
                ${contentHtml}
            </div>
        `;

        replaceContent(element, html);

        if(showCountdown) {
            const countdownEl = element.querySelector(`[${countdownDataAttr}]`);
            startCountdown(countdownEl, nextGameTime);
        }
        startRotatingCopy(activeEventId);
	}

	return {
        render,
        teardown: () => {
            if (countdownInst) {
                countdownInst.stop();
            }
            stopRotatingCopy()
        }
	};

};

export default pregameCountdown;