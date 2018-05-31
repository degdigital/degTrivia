// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

import { format as formatDate } from 'date-fns';

const marketingMessage = function(el) {

    function renderNextGameTime(nextGameTime) {
        const dateText = formatDate(nextGameTime, 'MMM D'); 
        const timeText = formatDate(nextGameTime, 'h:mma'); 
        return `<time datetime="${nextGameTime.toISOString()}" class="next-game__time">
                ${dateText} @ ${timeText}
            </time>`;
    }

    function renderMessage(copyObj, indx) {
        const key = Object.keys(copyObj)[indx];
        return `<div class="tv-screen__copy">${copyObj[key]}</div>`;
    }

	async function render(eventData, messageIndex) {
        replaceContent(el, `
            <div class="columns columns--two">
                <div class="column column--centered">
                    <img src="../../images/deg-logo.svg" class="tv-screen__logo" alt="DEG logo" />
                    ${renderMessage(eventData.tvCopy, messageIndex)}
                </div>
                <div class="column column--centered">
                    <h1 class="next-game__title">
                        <div class="next-game__title-intro next-game__title-intro--lg">Next Game</div>
                        ${renderNextGameTime(eventData.nextGameTime)}
                    </h1>
                    <div class="tv-screen__copy">Join online at <span class="text--emphasis">${eventData.url || 'degtrivia.com'}</span></div>
                    <div class="event-hashtag">${eventData.hashtag || ''}</div>
                </div>
            </div>
        `);
        return Promise.resolve();
	}

	return {
		render
	};

};

export default marketingMessage;