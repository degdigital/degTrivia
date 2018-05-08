let subscribers = [];

function init() {}

function subscribe(name, callback) {
	subscribers.push({
		name, callback
	});
}

function __fireEvent(name) {
	subscribers
		.filter(subscriber => subscriber.name === name)
		.forEach(subscriber => subscriber.callback());
}

function __reset() {
	subscribers = [];

}

const eventsService = {
	init,
	subscribe,
	__fireEvent,
	__reset
};

export default eventsService;