const tabs = function() {
	
	const triggerClass = 'tab-trigger';
	const sectionClass = 'tab-section';
	const activeClass = 'is-active';
	let triggerEls;
	let sectionEls;

	function init() {
		triggerEls = Array.from(document.querySelectorAll(`.${triggerClass}`));
		sectionEls = Array.from(document.querySelectorAll(`.${sectionClass}`));
		setInitialTab();
		bindEvents();
	}

	function bindEvents() {
		document.addEventListener('click', onDocClick);
	}

	function onDocClick(e) {
		const el = e.target;
		if (el.matches(`.${triggerClass}`)) {
			const sectionToShow = el.dataset.target;
			toggleTrigger(sectionToShow);
			toggleSection(sectionToShow);
		}
	}

	function setInitialTab() {
		const sectionFromUrl = getSectionFromUrl();
		const initialSection = sectionFromUrl || sectionEls[0].dataset.section;
		toggleTrigger(initialSection);
		toggleSection(initialSection, false);
	}

	function toggleTrigger(sectionToShow) {
		triggerEls.forEach(el => {
			const clsMethod = el.dataset.target === sectionToShow ? 'add' : 'remove';
			el.classList[clsMethod](activeClass);
		});
	}

	function toggleSection(sectionToShow, updateUrl = true) {
		sectionEls.forEach(el => {
			const clsMethod = el.dataset.section === sectionToShow ? 'add' : 'remove';
			el.classList[clsMethod](activeClass);
			if (updateUrl) {
				location.hash = sectionToShow;
			}
		});
	}

	function getSectionFromUrl() {
		const hashVal = location.hash;
		return hashVal.length > 0 ? hashVal.replace('#', '') : null;
	}

	init();

};

export default tabs;