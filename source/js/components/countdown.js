const unitSeparator = ':';
const millisecondsInDay = 86400000;
const millisecondsInHour = 3600000;
const millisecondsInMinute = 60000;
const millisecondsInSecond = 1000
const defaultInterval = 1000;

function convertFormat(settings, number, format = 'milliseconds') {
	if (number && settings.containerElement) {
		switch(format) {
			case 'milliseconds':
				return timer(number, settings);
			case 'seconds':
				return timer(number * millisecondsInSecond, settings);
			case 'minutes':
				return timer(number * millisecondsInMinute, settings);
			case 'hours':
				return timer(number * millisecondsInHour, settings);
			case 'days':
				return timer(number * millisecondsInDay, settings);             
		}
	}
}

function timer(milliseconds, {containerElement, format, onComplete}) {
	const endDate = Date.now() + milliseconds;

	const duration = calculateDuration(endDate);
	displayDuration(duration, format, containerElement);

	if(duration <= 0) {
		callOnComplete(onComplete);
		return null;
	}

	const interval = Math.min(defaultInterval, duration);

	const intervalId = setInterval(() => {
		const duration = calculateDuration(endDate);
		displayDuration(duration, format, containerElement);
		if(duration <= 0) {
			stopTimer(intervalId);
			callOnComplete(onComplete);
		};
	}, interval);

	return intervalId;
}

function calculateDuration(endDate) {
	return Math.max(endDate - Date.now(), 0);
}

function callOnComplete(onComplete) {
	if(onComplete) {
		onComplete();
	}
}

function getDays(duration) {
	return Math.floor(duration / millisecondsInDay);
}

function getHours(duration) {
	return Math.floor(duration % millisecondsInDay / millisecondsInHour);
}

function getMinutes(duration) {
	return Math.floor(duration % millisecondsInDay % millisecondsInHour / millisecondsInMinute);
}

function getSeconds(duration) {
	return Math.round(duration % millisecondsInDay % millisecondsInHour % millisecondsInMinute / millisecondsInSecond);
}

function getDurationPart(duration, unit) {
	switch(unit) {
		case 'dd':
			return getDays(duration);
		case 'hh':
			return getHours(duration);
		case 'mm':
			return getMinutes(duration);
		case 'ss':
		default:
			return getSeconds(duration);
	}
}

function getDurationParts(duration, format) {
	const formatParts = format.split(':');
	return formatParts.map(formatPart => padNumber(getDurationPart(duration, formatPart)));	
}
	
function displayDuration(duration, format, containerElement) {
	const durationParts = getDurationParts(duration, format);

	const durationMarkup = durationParts.join(unitSeparator);
	containerElement.innerHTML = `<span class="countdown__time">${durationMarkup}</span>`;
}

function padNumber(num) {
	return num < 10 ? `0${num.toString()}` : num.toString();
}

function stopTimer(intervalId) {
	clearInterval(intervalId);
}

export default function(opts) {
	const defaults = {
		containerElement: null,
		format: 'dd:hh:mm:ss',
		onComplete: null
	}
	const settings = Object.assign({}, defaults, opts);
	let intervalId;
	
	function start(num, format) {
		intervalId = convertFormat(settings, num, format)
	}

	return {
		start,
		stop: () => stopTimer(intervalId)
	}
};