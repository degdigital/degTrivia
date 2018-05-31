let onComplete;

function start() {
}

function stop() {
}

function __getInstance() {
	return instance;
}

function __complete() {
	if(onComplete) {
		onComplete();
	}
}

const instance = {
	start,
	stop
};

//const countdown = opts => instance;
const countdown = jest.fn();
countdown.mockImplementation(options => {
	onComplete = options.onComplete;
	return instance;
});
countdown.__getInstance = __getInstance;
countdown.__complete = __complete;

export default countdown;