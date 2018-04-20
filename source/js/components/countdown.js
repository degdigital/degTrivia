const countdown = (number, unit = 'milliseconds') => {
	const containerElement = document.querySelector('.countdown-container');
	let countdown;
	if(number && containerElement) {
		convertFormat(unit);
	}
    
    function convertFormat(format) {
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
  
    function timer(seconds) {
		const now = Date.now();
		const then = now + seconds * 1000;

		countdown = setInterval(() => {
			const secondsLeft = Math.round((then - Date.now()) / 1000);

			if(secondsLeft < 0) {
				clearInterval(countdown);
				return;
			};

			displayTimeLeft(secondsLeft);

		},1000);
	}

	function renderUnit(num, label) {
		return `
			<span class="countdown__time">${num}</span>
			<span class="countdown__unit">${label}${num === 1 ? '' : 's'}</span>
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
}

export default countdown;