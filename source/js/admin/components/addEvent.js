// Utils
import {replaceContent} from '../../utils/domUtils';
import formMapper from '../../utils/formMapper';

// Services
import dbService from '../../services/dbService.js';

const addEvent = function(wrapperEl, initialData) {

	const eventsRef = dbService.getDb().ref('events');

	const formClass = 'addevent-form';
	let formEl;

	function init() {
		bindEvents();
		render(initialData);
	}

	function bindEvents() {
		wrapperEl.addEventListener('submit', onSubmit);
	}

	function onSubmit(e) {
		e.preventDefault();
		const formVals = formMapper.getValues(formEl);
		saveFormData(formVals);
	}

	async function saveFormData(data) {
		const entryExists = await eventsRef.orderByChild('alias').equalTo(data.alias).once('value').then(snapshot => snapshot.exists());
		if (entryExists) {
			alert('Event already exists.');
		} else {
			const newKey = eventsRef.push().key;
			eventsRef.child(newKey).update({
				activeGameId: false,
				alias: data.alias.toLowerCase(),
				gameWaitBeforeQuestionsCopy: {
					description: data.gameWaitBeforeQuestionsCopyDescription,
					title: data.gameWaitBeforeQuestionsCopyTitle
				},
				games: false,
				hashtag: data.hashtag,
				leaderboardCopy: {
					description: data.leaderboardCopyDescription
				},
				name: data.name,
				postgameResultsCopy: {
					description: data.postgameResultsCopyDescription
				},
				registrationCopy: {
					title: data.registrationCopyTitle,
					disclosure: data.registrationCopyDisclosure
				}
			});
		}
	}

	function render(data) {
		replaceContent(wrapperEl, `
			<form class="${formClass}">
				<fieldset>
					<legend>Add an Event</legend>
					<div class="field">
						<label for="name">Name</label><br>
						<input id="name" name="name" type="text" required>
					</div>
					<div class="field">
						<label for="alias">Alias (this will be the password players enter during signup)</label><br>
						<input id="alias" name="alias" type="text" required>
					</div>
					<div class="field">
						<label for="hashtag">Hashtag</label><br>
						<input id="hashtag" name="hashtag" type="text">
					</div>
					<div class="field">
						<label for="gameWaitBeforeQuestionsCopyTitle">Game Wait Before Questions Title</label><br>
						<input class="input--extra-wide" id="gameWaitBeforeQuestionsCopyTitle" name="gameWaitBeforeQuestionsCopyTitle" type="text" value="Let's Play!">
					</div>
					<div class="field">
						<label for="gameWaitBeforeQuestionsCopyDescription">Game Wait Before Questions Description</label><br>
						<input class="input--extra-wide" id="gameWaitBeforeQuestionsCopyDescription" name="gameWaitBeforeQuestionsCopyDescription" type="text" value="Answer the questions (no stopping for wrong answers) as fast as you can. 10 seconds per question. Speed and accuracy wins. Here comes the first question.">
					</div>
					<div class="field">
						<label for="leaderboardCopyDescription">Leaderboard Description</label><br>
						<input class="input--extra-wide" id="leaderboardCopyDescription" name="leaderboardCopyDescription" type="text" value="Congrats on seeing your name in lights. Don't let someone steal your thunder. Play again to maintain your spot.">
					</div>
					<div class="field">
						<label for="postgameResultsCopyDescription">Postgame Results Description</label><br>
						<input class="input--extra-wide" id="postgameResultsCopyDescription" name="postgameResultsCopyDescription" type="text" value="Thanks for playing! See you again next week.">
					</div>
					<div class="field">
						<label for="registrationCopyTitle">Registration Title</label><br>
						<input class="input--extra-wide" id="registrationCopyTitle" name="registrationCopyTitle" type="text" value="Welcome to DEG Trivia!">
					</div>
					<div class="field">
						<label for="registrationCopyDisclosure">Registration Disclosure</label><br>
						<input class="input--extra-wide" id="registrationCopyDisclosure" name="registrationCopyDisclosure" type="text" value="By filling out this form, you are opting in to receiving notifications regarding DEG Trivia via email and SMS, as well as general follow-up communications from the agency. Learn more about <a href='https://www.degdigital.com/deg-full-service-digital-agency/privacy-policy/' target='_blank'>DEG’s privacy policy</a>.">
					</div>
					<button type="submit">Submit</button>
				</fieldset>
			</form>
		`);
		formEl = wrapperEl.querySelector(`.${formClass}`);
	}

	init();

};

export default addEvent;