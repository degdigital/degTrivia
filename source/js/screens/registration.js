import {replaceContent} from '../utils/domUtils.js';
import formMapper from '../utils/formMapper.js';
import playerService from '../services/playerService.js';

const registration = function({element}) {

	const registrationFormClass = 'registrationForm';

	function bindEvents() {
		element.addEventListener('submit', onFormSubmit);
	}

	function render() {
		replaceContent(element, `
			<h1>Welcome to DEG Trivia!</h1>
			<form class="${registrationFormClass}">
				<label for="firstName">First name</label><br>
				<input type="text" id="firstName" name="firstName" autofocus required><br><br>

				<label for="lastName">Last name</label><br>
				<input type="text" id="lastName" name="lastName" required><br><br>

				<label for="email">Email address</label><br>
				<input type="email" id="email" name="email" required><br><br>

				<label for="eventAlias">Event Code</label><br>
				<input type="text" id="eventAlias" name="eventAlias" required value="connections2018"><br><br>

				<button type="submit">Submit</button>
			</form>
		`);
	}

	function onFormSubmit(e) {
		const el = e.target;
		if (el.classList.contains(registrationFormClass)) {
			e.preventDefault();
			const formVals = formMapper.getValues(el);
			playerService.register(formVals)
				.then(successMsg => renderPostRegisterMessage(successMsg))
				.catch(errorMsg => renderPostRegisterMessage(errorMsg));
		}
	}

	function renderPostRegisterMessage(message) {
		replaceContent(element, `
			<p>${message}</p>
		`);
	}

	bindEvents();

	return {
		render
	};

};

export default registration;