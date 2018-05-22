import {replaceContent} from '../utils/domUtils.js';
import formMapper from '../utils/formMapper.js';
import playerService from '../services/playerService.js';

const registration = function({element}) {

	const registrationFormClass = 'registrationForm';
	const errorPlaceholderClass = 'error-placeholder';
	let errorPlaceholderEl;

	function bindEvents() {
		element.addEventListener('submit', onFormSubmit);
	}

	function render() {
		replaceContent(element, `
			<h1>Welcome to DEG Trivia!</h1>
			<span class="${errorPlaceholderClass}"></span>
			<form class="${registrationFormClass}">
				<label for="firstName">First name</label><br>
				<input type="text" id="firstName" name="firstName" autofocus required><br><br>

				<label for="lastName">Last name</label><br>
				<input type="text" id="lastName" name="lastName" required><br><br>

				<label for="email">Email address</label><br>
				<input type="email" id="email" name="email" required><br><br>

				<label for="companyName">Company</label><br>
				<input type="text" id="companyName" name="companyName" required><br><br>

				<label for="phoneNumber">Phone Number</label><br>
				<input type="tel" id="phoneNumber" name="phoneNumber" required minlength="10" maxlength="14" pattern="[0-9-+\s()]*$" placeholder="XXX-XXX-XXXX"><br><br>

				<label for="eventAlias">Event Code</label><br>
				<input type="text" id="eventAlias" name="eventAlias" required autocapitalize="none"><br><br>

				<button type="submit">Submit</button>
			</form>
		`);
		errorPlaceholderEl = element.querySelector(`.${errorPlaceholderClass}`);
	}

	function onFormSubmit(e) {
		const el = e.target;
		if (el.classList.contains(registrationFormClass)) {
			e.preventDefault();
			const formVals = formMapper.getValues(el);
			playerService.register(formVals)
				.then(successMsg => renderPostRegisterMessage(element, successMsg))
				.catch(errorMsg => {
					renderPostRegisterMessage(errorPlaceholderEl, errorMsg)
				});
		}
	}

	function renderPostRegisterMessage(el, message) {
		replaceContent(el, `
			<p>${message}</p>
		`);
	}

	bindEvents();

	return {
		render
	};

};

export default registration;