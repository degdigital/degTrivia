function start() {
}

function stop() {
}

function __getInstance() {
	return instance;
}

const instance = {
	start,
	stop
};

//const countdown = opts => instance;
const countdown = jest.fn();
countdown.mockReturnValue(instance);
countdown.__getInstance = __getInstance;

export default countdown;