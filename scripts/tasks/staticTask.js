const path = require('path');
const fse = require('fs-extra');

const filesToProcess = ['images', 'fonts'];

function copy(srcFilepath, destFilepath) {
	return fse.copy(srcFilepath, destFilepath)
		.then(() => true)
		.catch(e => {
			console.error(`Error copying file or directory "${srcFilepath}":`, e);
			return false;
		});
} 

function run() {
	console.log('Static file task started.');

	const promises = filesToProcess.map(file => {
		const srcFilepath = path.resolve('source', file);
		const destFilepath = path.resolve('public', file);
		return copy(srcFilepath, destFilepath);
	});

	return Promise.all(promises)
		.then(results => {
			const success = results.every(result => result);
			if(success) {
				console.log('Static file task complete.');
			} else {
				console.error('Static file task failed.');
			}
			return success;
		});
}

module.exports = {
	run
};