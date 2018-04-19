import {replaceContent} from '../utils/domUtils.js';
import formMapper from '../utils/formMapper.js';
import dbService from '../services/dbService.js';

const gameLanding = function({element, eventAlias}) {

	const formClass = 'js-welcome-form';

	function bindEvents() {
		element.addEventListener('submit', onFormSubmit);
	}

	async function render({user}) {
		const event = await dbService.getEvent(eventAlias);
		console.log(event);
		if (!event) {
			replaceContent(element, `
				Event not found.
			`);
		} else if (user) {
			renderLoggedInUser(user);
		} else {
			renderLoggedOutUser();
		}
		
	}

	function renderLoggedInUser(user) {
		replaceContent(element, `
			User found.
		`);
	}

	function renderLoggedOutUser() {
		replaceContent(element, `
			<h1>Welcome to DEG Trivia!</h1>
			<form class="${formClass}">
				<label for="firstName">First name</label><br>
				<input type="text" id="firstName" name="firstName" autofocus required value="Bob"><br><br>

				<label for="lastName">Last name</label><br>
				<input type="text" id="lastName" name="lastName" required value="Jones"><br><br>

				<label for="email">Email address</label><br>
				<input type="email" id="email" name="email" required value="bobjones@gmail.com"><br><br>

				<button type="submit">Submit</button>
			</form>
		`);
	}

	function onFormSubmit(e) {
		const el = e.target;
		if (el.classList.contains(formClass)) {
			e.preventDefault();
			const formVals = {
				...{eventAlias},
				...formMapper.getValues(el)
			};
			dbService.createPlayer(formVals)
				.then(() => console.log('player created'));
		}
	}

	bindEvents();

	return {
		render
	};

};

export default gameLanding;