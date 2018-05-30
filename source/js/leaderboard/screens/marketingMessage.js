// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const manager = function(el) {

	async function render(dbData) {
        replaceContent(el, `
        <div class="columns columns--two">
            <div class="column column--centered">
                Rotating Copy
            </div>
            <div class="column column--centered">
                <h1 class="next-game__title">
                    <div class="next-game__title-intro next-game__title-intro--lg">Next Game</div>
                    <time datetime="2018-07-18T12:30:00.000" class="next-game__time">
                        12:30PM PST
                    </time>
                </h1>
                <div class="tv-screen__copy">Join online at <span class="text--emphasis">cnxtrivia.com</span></div>
                <div class="event-hashtag">#CNXTRIVIA</div>
            </div>
        </div>
        `);
        return Promise.resolve();
	}

	return {
		render
	};

};

export default manager;