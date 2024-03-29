import {replaceContent} from '../utils/domUtils.js';
import dbService from '../services/dbService.js';

function loadLeaderboardData() {
    return dbService.getLeaderboardData();
}

function getTimeElapsed(ms) {
    return Math.round((ms / 1000), 2);
}

function renderTableBody(leaderData) {
    return leaderData.map((leader, index) => (
        `<tr class="table__row table__data-row">
            <td class="table__data-cell">${index + 1}</td>
            <td class="table__data-cell">${leader.name}</td>
            <td class="table__data-cell">${leader.score}</td>
            <td class="table__data-cell">${getTimeElapsed(leader.timeElapsed)}s</td>
        </tr>`
    )).join('');
}

function renderLeaderboard(data) {
    let returnMarkup;
    if (data) {
        returnMarkup = `
            <table class="table">
                <caption class="table__caption">Leaders</caption>
                <colgroup>
                    <col class="table__col table__col--small"></col>
                    <col class="table__col table__col--md"></col>
                    <col class="table__col table__col--small"></col>
                    <col class="table__col"></col>
                </colgroup>
                <tbody class="table__table-body">${renderTableBody(data)}</tbody>
            </table>
        `;
    } else {
        returnMarkup = '<div>No leaderboard data to display.</div>'
    }
   
    return returnMarkup;
}

// dataType is either "game" or "event"
async function render(containerElement, dataType) {
    const leaderboardData = await loadLeaderboardData();
    replaceContent(containerElement, renderLeaderboard(leaderboardData[dataType]));
}

export default function() {
    return {
        renderToElement: render
    }
}