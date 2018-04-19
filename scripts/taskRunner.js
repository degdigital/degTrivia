const staticTask = require('./tasks/staticTask');
const htmlTask = require('./tasks/htmlTask');
const cssTask = require('./tasks/cssTask');
const jsTask = require('./tasks/jsTask');

const tasks = {
	'static': staticTask,
	'html': htmlTask,
	'css': cssTask,
	'js': jsTask
};

function runTask(taskName) {
	if(tasks[taskName]) {
		return tasks[taskName].run();
	}

	return Promise.reject(`Could not find task "${taskName}".`);
}

function runAllTasks() {
	const promises = Object.keys(tasks).map(taskName => runTask(taskName));
	return Promise.all(promises)
		.then(results => results.every(result => result));
}

module.exports = {
	runTask,
	runAllTasks
};