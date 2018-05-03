const units = ['second', 'minute', 'hour', 'day'];

function convertFormat(settings, number, format = 'milliseconds') {
	if (number && settings.containerElement) {
		switch(format) {
			case 'milliseconds':
				return timer(number, settings);
			case 'seconds':
				return timer(number * 1000, settings);
			case 'minutes':
				return timer(number * 60 * 1000, settings);
				case 'hours':
				return timer(number * 60 * 60 * 1000, settings);
			case 'days':
				return timer(number * 60 * 60 * 24 * 1000, settings);             
		}
	}
}

function getTimeLeft(secondsLeft) {
	return {
		day: Math.floor(secondsLeft / 86400),
		hour: Math.floor((secondsLeft % 86400) / 3600),
		minute: Math.floor((secondsLeft % 86400) % 3600 / 60),
		second: secondsLeft % 60 < 10 ? `0${secondsLeft % 60}` : secondsLeft % 60
	};
}

function timer(milliseconds, {containerElement, includeLabels, precision}) {
	const now = Date.now();
	const then = now + milliseconds;
	
	const currentTime = Math.round((then - Date.now()) / 1000);
	displayTimeLeft(getTimeLeft(currentTime), containerElement, includeLabels, precision);

	const countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);

		if(secondsLeft < 0) {
			stopTimer(countdown);
			return;
		};

		displayTimeLeft(getTimeLeft(secondsLeft), containerElement, includeLabels, precision);

	},1000);

	return countdown;
}

function renderUnit(num, label, includeLabels) {
	if (includeLabels) {
		return `
			<span class="countdown__time">${num}</span>
			<span class="countdown__unit">${label}${num === 1 || num === '01' ? '' : 's'}</span>
		`;
	}
	return `<span class="countdown__time">${num}</span>`;
	
}
	
function displayTimeLeft(timeLeft, containerElement, includeLabels, precision) {
	const timeUnits = [];
	const separator = includeLabels ? '' : ':';

	for (let i = 0; i <= units.indexOf(precision); i++) {
		const unit = units[i];
		timeUnits.push(renderUnit(timeLeft[unit], unit, includeLabels));
	}
	const markup = timeUnits.reverse();
	console.log(timeLeft);
	containerElement.innerHTML = markup.join(separator);
}

function stopTimer(countdown) {
	clearInterval(countdown);
}

export default function(opts) {
	const defaults = {
		containerElement: null,
		includeLabels: true,
		precision: 'day'
	}
	const settings = Object.assign({}, defaults, opts);
	let countdown;
	
	function start(num, format) {
		countdown = convertFormat(settings, num, format)
	}

	return {
		start,
		stop: () => stopTimer(countdown)
	}
};