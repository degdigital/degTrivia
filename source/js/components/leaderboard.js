import {replaceContent} from '../utils/domUtils.js';
import dbService from '../services/dbService.js';
import tabs from './tabs.js';

const leaderboardSections = ['game', 'event'];

function loadLeaderboardData() {
    return dbService.getLeaderboardData();
}

function renderTableBody(leaderData) {
    return leaderData.map((leader, index) => (
        `<tr>
            <td>${index + 1}.</td>
            <td>${leader.name}</td>
            <td>${leader.score}</td>
        </tr>`
    )).join('');
}

function renderLeaderboard(data) {
    let returnMarkup;
    if (data) {
        returnMarkup = '<div>Top 10 Players</div>';
        returnMarkup += `
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>${renderTableBody(data)}</tbody>
            </table>
        `;
    } else {
        returnMarkup = '<div>No leaderboard data to display.</div>'
    }
   
    return returnMarkup;
}

async function render(containerElement) {
    const leaderboardData = await loadLeaderboardData();
    replaceContent(containerElement, `
        <div class="tabs-container">
            <div class="tab-group">
                <button class="button button--short tab-button tab-button--active" data-tab-index="0">Game</button>
                <button class="button button--short tab-button" data-tab-index="1">Event</button>
            </div>
            <div class="tab-section tab-section--game">
                ${renderLeaderboard(leaderboardData.game)}
            </div>
            <div class="tab-section tab-section--event is-hidden">
                ${renderLeaderboard(leaderboardData.event)}
            </div>
        </div>
    `);
    tabs(document.querySelector('.tabs-container'));
}

export default function() {
    return {
        renderToElement: render
    }
}