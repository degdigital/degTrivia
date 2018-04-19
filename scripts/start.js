const { spawn } = require('child_process');
const taskRunner = require('./taskRunner');

taskRunner.runAllTasks()
	.then(success => {
		if(success) {
			spawn('node', ['scripts/watch'], { stdio: 'inherit' });
			spawn('firebase', ['serve'], { stdio: 'inherit' });
		}
	});