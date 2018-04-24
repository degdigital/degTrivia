import {replaceContent} from '../utils/domUtils.js';
import dbService from '../services/dbService.js';
import tabs from './tabs.js';

const leaderboardSections = ['game', 'day', 'event'];

function loadLeaderboardData() {
    return dbService.getLeaderboards();
}

function renderTableBody(leaderData) {
    return leaderData.map(leader => (
        `<tr>
            <td>${leader.name}</td>
            <td>${leader.score}</td>
        </tr>`
    )).join('');
}

function renderLeaderboard(data) {
    let returnMarkup = '<div>Top 20 Players</div>';
    returnMarkup += `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>${renderTableBody(data.leaders)}</tbody>
        </table>
    `;
    return returnMarkup;
}

async function render(containerElement) {
    // get leaderboard data
    // on render, render tables into correct sections
    const leaderboardData = await loadLeaderboardData();
    replaceContent(containerElement, `
        <div class="tabs-container">
            <div class="tab-group">
                <button class="button button--short tab-button tab-button--active" data-tab-index="0">Game</button>
                <button class="button button--short tab-button" data-tab-index="1">Day</button>
                <button class="button button--short tab-button" data-tab-index="2">Event</button>
            </div>
            <div class="tab-section tab-section--game" data-section-name="game">
                ${renderLeaderboard(leaderboardData.game)}
            </div>
            <div class="tab-section tab-section--day is-hidden" data-section-name="day">
                ${renderLeaderboard(leaderboardData.day)}
            </div>
            <div class="tab-section tab-section--event is-hidden" data-section-name="event">
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