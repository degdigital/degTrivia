// Utils
import {replaceContent} from '../../utils/domUtils';

// Services
import dbService from '../../services/dbService.js';

const manager = function(el) {

    function renderTableBody(data) {
        let returnMarkup = '';
        if (data) {
            returnMarkup += data.map((leader, index) => (
                `<tr>
                     <td>${index + 1}</td>
                     <td>${leader.name}</td>
                     <td>${leader.score}</td>
                </tr>`
            )).join('');
        } else {
            for (let i = 0; i < 10; i++) {
                returnMarkup += `
                <tr>
                     <td>${index + 1}</td>
                     <td></td>
                     <td></td>
                 </tr>
                `
            }
        }
        return returnMarkup
    }

    function renderLeaderboard(data, title) {
       return `
       <table>
            <caption class="table__caption">${title}</caption>
            <tbody>
                ${renderTableBody(data)}
            </tbody>
        </table>
       `;
    }


	async function render(dbData) {
        let leaderboardData = dbData;
        if (!dbData) {
            leaderboardData = await dbService.getLeaderboardData();
        }
        replaceContent(el, `
        <div class="page-width page-width--wide">
			<h1 class="text--centered">DEG Trivia Leaderboard</h1>
            <div class="columns columns--two">
                <div class="column">
                    ${renderLeaderboard(leaderboardData.game, 'Last Game')}
                </div>
                <div class="column">
                    ${renderLeaderboard(leaderboardData.event, 'Event')}
                </div>
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