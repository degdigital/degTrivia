function convertFormat(containerElement, number, format = 'milliseconds') {
	if (number && containerElement) {
		switch(format) {
			case 'milliseconds':
				return timer(number / 1000, containerElement);
			case 'seconds':
				return timer(number, containerElement);
			case 'minutes':
				return timer(number * 60, containerElement);
				case 'hours':
				return timer(number * 60 * 60, containerElement);
			case 'days':
				return timer(number * 60 * 60 * 24, containerElement);             
		}
	}
}

function timer(seconds, containerElement) {
	const now = Date.now();
	const then = now + seconds * 1000;

	const countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);

		if(secondsLeft < 0) {
			stopTimer(countdown);
			return;
		};

		displayTimeLeft(secondsLeft, containerElement);

	},1000);

	return countdown;
}

function renderUnit(num, label) {
	return `
		<span class="countdown__time">${num}</span>
		<span class="countdown__unit">${label}${num === 1 || num === '01' ? '' : 's'}</span>
	`;
}
	
function displayTimeLeft(seconds, containerElement) {
	containerElement.innerHTML = `
		${renderUnit(Math.floor(seconds / 86400), 'day')}
		${renderUnit(Math.floor((seconds % 86400) / 3600), 'hour')}
		${renderUnit(Math.floor((seconds % 86400) % 3600 / 60), 'minute')}
		${renderUnit(seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60, 'second')}
	`;
}

function stopTimer(countdown) {
	clearInterval(countdown);
}

export default function() {
	const containerElement = document.querySelector('.countdown-container');
	let countdown;
	
	function start(num, format) {
		countdown = convertFormat(containerElement, num, format)
	}

	return {
		start,
		stop: () => stopTimer(countdown)
	}
};