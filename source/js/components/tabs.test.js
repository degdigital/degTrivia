import tabs from './tabs.js';
import polyfillsForTests from '../utils/testUtils.js';

describe('tabs', () => {
    let containerEl;

    polyfillsForTests();

    beforeEach(() => {
        containerEl = document.createElement('div');
        containerEl.classList.add('tabs-container');
        containerEl.innerHTML = `
            <div class="tab-group">
                <button class="button button--short tab-button tab-button--active" data-tab-index="0">Game</button>
                <button class="button button--short tab-button" data-tab-index="1">Day</button>
                <button class="button button--short tab-button" data-tab-index="2">Event</button>
            </div>
            <div class="tab-section tab-section--game">Game</div>
            <div class="tab-section tab-section--day is-hidden">Day</div>
            <div class="tab-section tab-section--event is-hidden">Event</div>
        `;
        document.body.appendChild(containerEl);
        tabs(containerEl);
    });

    it('should change content on tab click', () => {
        const dayTabBtn = document.querySelector('[data-tab-index="1"]');
        dayTabBtn.click();
        expect(containerEl).toMatchSnapshot();
    })

});