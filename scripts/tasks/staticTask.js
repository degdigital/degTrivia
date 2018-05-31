const path = require('path');
const fse = require('fs-extra');

const filesToProcess = ['images', 'fonts'];

function copy(srcFilepath, destFilepaths) {
	const promises = destFilepaths.map(destFilepath => 
		fse.copy(srcFilepath, destFilepath)
	);

	return Promise.all(promises)
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
		const destFilepaths = [
			path.resolve('public', file),
			path.resolve('patternlab', file)
		];

		return copy(srcFilepath, destFilepaths);
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