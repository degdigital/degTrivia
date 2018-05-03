function convertFormat(settings, number, format = 'milliseconds') {
	if (number && settings.containerElement) {
		switch(format) {
			case 'milliseconds':
				return timer(number, settings.containerElement, settings.includeLabels);
			case 'seconds':
				return timer(number * 1000, settings.containerElement, settings.includeLabels);
			case 'minutes':
				return timer(number * 60 * 1000, settings.containerElement, settings.includeLabels);
				case 'hours':
				return timer(number * 60 * 60 * 1000, settings.containerElement, settings.includeLabels);
			case 'days':
				return timer(number * 60 * 60 * 24 * 1000, settings.containerElement, settings.includeLabels);             
		}
	}
}

function timer(milliseconds, containerElement, includeLabels) {
	const now = Date.now();
	const then = now + milliseconds;

	const countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);

		if(secondsLeft < 0) {
			stopTimer(countdown);
			return;
		};

		displayTimeLeft(secondsLeft, containerElement, includeLabels);

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
	return num > 0 ? `<span class="countdown__time">${num}:</span>` : '';
	
}
	
function displayTimeLeft(seconds, containerElement, includeLabels) {
	containerElement.innerHTML = `
		${renderUnit(Math.floor(seconds / 86400), 'day', includeLabels)}
		${renderUnit(Math.floor((seconds % 86400) / 3600), 'hour', includeLabels)}
		${renderUnit(Math.floor((seconds % 86400) % 3600 / 60), 'minute', includeLabels)}
		${renderUnit(seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60, 'second', includeLabels)}
	`;
}

function stopTimer(countdown) {
	clearInterval(countdown);
}

export default function(opts) {
	const defaults = {
		containerElement: null,
		includeLabels: true
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