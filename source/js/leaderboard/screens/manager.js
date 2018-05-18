// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const manager = function(el) {


	function render() {
		replaceContent(el, `
			<h1>DEG Trivia Leaderboard</h1>
            <div class="columns columns--two">
                <div class="column">
                    Last Game
                </div>
                <div class="column">
                    Event
                </div>
            </div>
		`);
	}

	return {
		render
	};

};

export default manager;