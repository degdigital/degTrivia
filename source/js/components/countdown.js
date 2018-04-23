let containerElement;
let countdown;

function convertFormat(number, format = 'milliseconds') {
	if (number && containerElement) {
		switch(format) {
			case 'milliseconds':
				return timer(number / 1000);
			case 'seconds':
				return timer(number);
			case 'minutes':
				return timer(number * 60);
				case 'hours':
				return timer(number * 60 * 60);
			case 'days':
				return timer(number * 60 * 60 * 24);             
		}
	}
}

function timer(seconds) {
	const now = Date.now();
	const then = now + seconds * 1000;

	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);

		if(secondsLeft < 0) {
			stopTimer();
			return;
		};

		displayTimeLeft(secondsLeft);

	},1000);
}

function renderUnit(num, label) {
	return `
		<span class="countdown__time">${num}</span>
		<span class="countdown__unit">${label}${num === 1 || num === '01' ? '' : 's'}</span>
	`;
}
	
function displayTimeLeft(seconds) {
	containerElement.innerHTML = `
		${renderUnit(Math.floor(seconds / 86400), 'day')}
		${renderUnit(Math.floor((seconds % 86400) / 3600), 'hour')}
		${renderUnit(Math.floor((seconds % 86400) % 3600 / 60), 'minute')}
		${renderUnit(seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60, 'second')}
	`;
}

function stopTimer() {
	clearInterval(countdown);
}

export default function() {
	containerElement = document.querySelector('.countdown-container');

	return {
		start: convertFormat,
		stop: stopTimer
	}
};