let activeIndex;
let sectionEls;
let navItemEls;

function renderTabButtons(containerEl, sectionEls) {
    let markup = '<div class="tab-group">';
    markup += sectionEls.map((sectionEl, indx) => {
        const activeClass = indx === 0 ? 'tab-button--active' : '';
        return `
            <button class="button tab-button ${activeClass}" data-tab-index=${indx}>
                ${sectionEl.getAttribute('data-tab-name')}
            </button>
        `;
    }).join('');
    markup += '</div>';
   
    containerEl.insertAdjacentHTML('afterbegin', markup);
}

function activateTab(newIndex) {
    //TODO: polyfill classList toggle
    sectionEls.forEach((sectionEl, index) => {
        sectionEl.classList.toggle('is-hidden', index !== newIndex);
    });
    navItemEls.forEach((navItemEl, index) => {
        navItemEl.classList.toggle('tab-button--active', index === newIndex);
    });
}

function bindEvents(containerEl) {
    containerEl.addEventListener('click', onTabClick);
}

function onTabClick(event) {
    // TODO: polyfill closest
    const navEl = event.target.closest('.tab-button');
    if (navEl) {
        const index = parseInt(navEl.getAttribute('data-tab-index'));
        activeIndex = index;
        activateTab(index);
    }
}

function destroy(containerEl) {
    if (containerEl) {
        containerEl.removeEventListener('click', onTabClick);
    }
}

export default function(containerEl) {
    if (containerEl) {
        sectionEls = [...containerEl.querySelectorAll('.tab-section')];
        renderTabButtons(containerEl, sectionEls);

        navItemEls = [...containerEl.querySelectorAll('.tab-button')];
        bindEvents(containerEl);
    }

    return {
        destroy: () => destroy(containerEl)
    }
}