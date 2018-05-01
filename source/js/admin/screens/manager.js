// Utils
import {replaceContent} from '../../utils/domUtils';

// Components
import killSwitch from '../components/killSwitch.js';
import resetApp from '../components/resetApp.js';

const manager = function(el) {

	const killSwitchWrapperClass = 'killswitch-wrapper';
	const resetAppWrapperClass = 'resetapp-wrapper';

	function render() {
		replaceContent(el, `
			<h1>Welcome, admin!</h1>
			<div class="${killSwitchWrapperClass}"></div><br>
			<div class="${resetAppWrapperClass}"></div>
		`);
		killSwitch(el.querySelector(`.${killSwitchWrapperClass}`));
		resetApp(el.querySelector(`.${resetAppWrapperClass}`));
	}

	return {
		render
	};

};

export default manager;