const countdown = (number, unit) => {
    // const d = document;
    // const daysElement = d.querySelector('.days');
    // const hoursElement = d.querySelector('.hours');
    // const minutesElement = d.querySelector('.minutes');
	// const secondsElement = d.querySelector('.seconds');
	const containerElement = document.querySelector('.countdown-container');
    let countdown;
    convertFormat(unit);
    
    
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
  
    function displayTimeLeft(seconds) {
		containerElement.innerHTML = `
			<span class="countdown__time">${Math.floor(seconds / 86400)}</span>
			<span class="countdown__unit">days</span>
			<span class="countdown__time">${Math.floor((seconds % 86400) / 3600)}</span>
			<span class="countdown__unit">hours</span>
			<span class="countdown__time">${Math.floor((seconds % 86400) % 3600 / 60)}</span>
			<span class="countdown__unit">minutes</span>
			<span class="countdown__time">${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}</span>
			<span class="countdown__unit">seconds</span>
		`;
		// daysElement.textContent = Math.floor(seconds / 86400);
		// hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
		// minutesElement.textContent = Math.floor((seconds % 86400) % 3600 / 60);
		// secondsElement.textContent = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
    }
}

export default countdown;