// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

import { format as formatDate } from 'date-fns';

const marketingMessage = function(el) {

    function renderNextGameTime(nextGameTime) {
        if (nextGameTime) {
            const dateText = formatDate(nextGameTime, 'MMM D'); 
            const timeText = formatDate(nextGameTime, 'h:mma'); 
            return `<time datetime="${nextGameTime.toISOString()}" class="next-game__time">
                    ${dateText} @ ${timeText}
                </time>`;
        }
        return `
            <div class="next-game__time">
                No more games scheduled.
            </div>
        `
    }

	async function render(eventData) {
        replaceContent(el, `
        <main class="main tv-screen page-width page-width--wide">
            <div class="tv-screen__content tv-screen__content--centered">
                <img src="../../images/deg-logo.svg" class="tv-screen__logo" alt="DEG logo" />
                <h1 class="next-game__title">
                    <div class="next-game__title-intro next-game__title-intro--lg">Next Game</div>
                    ${renderNextGameTime(eventData.nextGameTime)}
                </h1>
                <div class="tv-screen__copy">Join online at <span class="text--emphasis">${eventData.url || 'degtrivia.com'}</span></div>
                <div class="event-hashtag">${eventData.hashtag || ''}</div>
            </div>
        </main>
        `);
        return Promise.resolve();
	}

	return {
		render
	};

};

export default marketingMessage;