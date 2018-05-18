const path = require('path');
const fse = require('fs-extra');

const filesToProcess = ['index.html', 'admin/index.html', 'leaderboard/index.html'];

function copyFile(srcFilepath, destFilepath) {
	return fse.copy(srcFilepath, destFilepath)
		.then(() => true)
		.catch(e => {
			console.error(`Error copying file "${srcFilepath}":`, e);
			return false;
		});
} 

function run() {
	console.log('HTML task started.');

	const promises = filesToProcess.map(file => {
		const srcFilepath = path.resolve('source', file);
		const destFilepath = path.resolve('public', file);
		return copyFile(srcFilepath, destFilepath);
	});

	return Promise.all(promises)
		.then(results => {
			const success = results.every(result => result);
			if(success) {
				console.log('HTML task complete.');
			} else {
				console.error('HTML task failed.');
			}
			return success;
		});
}

module.exports = {
	run
};