const taskRunner = require('./taskRunner');
const chokidar = require('chokidar');

const watchTargets = require('./watchTargets');

const validEventTypes = ['add', 'change', 'unlink'];

const friendlyEventTypes = {
	add: 'added',
	change: 'changed',
	unlink: 'deleted'
};

function isValidEventType(eventType) {
	return validEventTypes.includes(eventType);
}

function onFileEvent(eventType, filepath, target) {
	if(isValidEventType(eventType)) {
		console.log(`File "${filepath}" was ${friendlyEventTypes[eventType]}.`);
		taskRunner.runTask(target.taskName);
	}
}

function createWatcher(target) {
	let watcher;

	try {
		watcher = chokidar.watch(target.paths, {ignoreInitial: true});
	} catch(e) {
		console.error(`Failed to initialize watcher for paths "${target.paths}" .`);
		return;
	}

	watcher.on('all', (eventType, filepath) => onFileEvent(eventType, filepath, target));
}

function init() {
	watchTargets.forEach(target => {
		createWatcher(target);
	});

	console.log('Watching...');
}

init();


