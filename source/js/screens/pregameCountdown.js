import {replaceContent} from '../utils/domUtils.js';
import countdown from '../components/countdown.js';
import dbService from '../services/dbService.js';
import { format as formatDate, isSameDay, differenceInMilliseconds } from 'date-fns';

const countdownThreshold = 900000; //15 minutes in milliseconds
const countdownDataAttr = 'data-countdown';

const pregameCountdown = function(element) {
    let countdownInst;

    function renderNoNextGameMessage() {
        return `<p>No other games are currently scheduled.</p>`;
    }

    function renderCountdown() {
        return `<div class="countdown next-game__time" ${countdownDataAttr}></div>`;
    }

    function renderNextGameTime(nextGameTime) {
        console.log(nextGameTime);
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
                <p class="next-game__message">Speed counts! Answer as quickly as you can.</p>
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
        const nextGameTime = await dbService.getNextGameTime();
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