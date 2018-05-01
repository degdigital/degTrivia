// Utils
import {replaceContent} from '../utils/domUtils';

// Services
import playerService from '../services/playerService.js';

const login = function(element, options = {}) {

	const defaults = {
		formClass: 'js-login-form',
		emailInputClass: 'js-email-input',
		passwordInputClass: 'js-password-input',
		errorWrapperClass: 'js-error-wrapper'
	};

	let auth = playerService.getAuth(),
		settings,
		emailInputEl,
		passwordInputEl,
		errorWrapperEl;

	function init() {
		settings = Object.assign({}, defaults, options);
		bindEvents();
	}

	function bindEvents() {
		document.addEventListener('submit', onFormSubmit);
	}

	function onFormSubmit(e) {
		let el = e.target;
		if (el.matches('.' + settings.formClass)) {
			e.preventDefault();
			const email = emailInputEl.value,
				password = passwordInputEl.value;

			auth.signInWithEmailAndPassword(email, password)
				.catch(onLoginError);
		}
	}

	function onLoginError(error) {
		console.log(error.code);
		replaceContent(errorWrapperEl, error.message);
	}

	function renderForm() {
		replaceContent(element, `
			<form class="${settings.formClass}">
				<legend>Login</legend>
				<fieldset>
					<div class="field">
						<label for="email">Email address</label><br>
						<input class="${settings.emailInputClass}" name="email" id="email" type="email" required>
					</div>
					<div class="field">
						<label for="password">Password</label><br>
						<input class="${settings.passwordInputClass}" name="password" id="password" type="password" required>
					</div>
					<button type="submit">Login</button>
				</fieldset>
				<div class="${settings.errorWrapperClass}"></div>
			</form>
		`);
		emailInputEl = element.querySelector('.' + settings.emailInputClass);
		passwordInputEl = element.querySelector('.' + settings.passwordInputClass);
		errorWrapperEl = element.querySelector('.' + settings.errorWrapperClass);
	}

	init();

	return {
		renderForm: renderForm
	};

};

export default login;