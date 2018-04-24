import {replaceContent} from '../utils/domUtils.js';
import tabs from './tabs.js';

const leaderboardSections = ['game', 'day', 'event'];

function render(containerElement) {
    replaceContent(containerElement, `
    <div class="tabs-container">
        <div class="tab-group">
            <button class="button button--short tab-button tab-button--active" data-tab-index="0">Game</button>
            <button class="button button--short tab-button" data-tab-index="1">Day</button>
            <button class="button button--short tab-button" data-tab-index="2">Event</button>
        </div>
        <div class="tab-section tab-section--game" data-section-name="game">Game</div>
        <div class="tab-section tab-section--day is-hidden" data-section-name="day">Day</div>
        <div class="tab-section tab-section--event is-hidden" data-section-name="event">Event</div>
    </div>
    `);
    tabs(document.querySelector('.tabs-container'));
}

export default function() {
    // init tabs and mobile tabs
    // init load data for tables

    return {
        renderToElement: render
    }
}