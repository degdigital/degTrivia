import tabs from './tabs.js';
import polyfillsForTests from '../utils/testUtils.js';

describe('tabs', () => {
    let containerEl;

    polyfillsForTests();

    beforeEach(() => {
        containerEl = document.createElement('div');
        containerEl.classList.add('tabs-container');
        containerEl.innerHTML = `
        <div class="tabs-container">
            <div class="tab-section tab-section--game" data-tab-name="Game"></div>
            <div class="tab-section tab-section--event is-hidden" data-tab-name="Event"></div>
        </div>
        `;
        document.body.appendChild(containerEl);
        tabs(containerEl);
    });

    it('should render tabs', () => {
        expect(containerEl).toMatchSnapshot();
    })

    it('should change content on tab click', () => {
        const dayTabBtn = document.querySelector('[data-tab-index="1"]');
        dayTabBtn.click();
        expect(containerEl).toMatchSnapshot();
    })

});