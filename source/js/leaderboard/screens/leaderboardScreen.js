// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const manager = function(el) {

    function getTimeElapsed(ms) {
        return Math.round((ms / 1000), 2);
    }

    function renderTableBody(data) {
        let returnMarkup = '';
        if (data) {
            returnMarkup += data.map((leader, index) => (
                `<tr class="table__row table__data-row">
                     <td class="table__data-cell">${index + 1}</td>
                     <td class="table__data-cell">${leader.name}</td>
                     <td class="table__data-cell">${leader.score}</td>
                     <td class="table__data-cell">${getTimeElapsed(leader.timeElapsed)}s</td>
                </tr>`
            )).join('');
        } else {
            for (let index = 0; index < 10; index++) {
                returnMarkup += `
                <tr class="table__row table__data-row">
                     <td class="table__data-cell">${index + 1}</td>
                     <td class="table__data-cell"></td>
                     <td class="table__data-cell"></td>
                 </tr>
                `
            }
        }
        return returnMarkup
    }

    function renderLeaderboard(data, title) {
       return `
       <table class="table">
            <caption class="table__caption">${title}</caption>
            <colgroup>
                <col class="table__col table__col--small"></col>
                <col class="table__col table__col--md"></col>
                <col class="table__col table__col--small"></col>
                <col class="table__col"></col>
            </colgroup>
            <tbody class="table__table-body">
                ${renderTableBody(data)}
            </tbody>
        </table>
       `;
    }


	async function render(leaderboardData) {
        replaceContent(el, `
			<h1 class="page-title page-title--centered">Trivia Leaderboard</h1>
            <div class="columns columns--two">
                <div class="column">
                    ${renderLeaderboard(leaderboardData.game, 'Last Game')}
                </div>
                <div class="column">
                    ${renderLeaderboard(leaderboardData.event, 'Event')}
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