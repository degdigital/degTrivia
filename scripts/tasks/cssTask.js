const path = require('path');
const fse = require('fs-extra');
const postcss = require('postcss');

const plugins = [
	require('postcss-easy-import'),  
	require('postcss-color-function'),
	require('cssnano'),
	require('autoprefixer')
];
const filesToProcess = ['main.css'];

function processFile(srcFilepath, destFilepath, plugins) {
	return fse.readFile(srcFilepath)
		.then(contents =>
			postcss(plugins).process(contents, {
				from: srcFilepath,
				to: destFilepath
			})
		)
		.then(result => fse.outputFile(destFilepath, result.css))
		.then(() => true)
		.catch(e => {
			console.error(`Error processing CSS file "${srcFilepath}":`, e);
			return false;
		});
};

function run() {
	console.log('CSS task started.');

	const promises = filesToProcess.map(file => {
		const srcFilepath = path.resolve('source/css', file);
		const destFilepath = path.resolve('public/css', file);
		return processFile(srcFilepath, destFilepath, plugins);
	});

	return Promise.all(promises)
		.then(results => {
			const success = results.every(result => result);
			if(success) {
				console.log('CSS task complete.');
			} else {
				console.error('CSS task failed.');
			}
			return success;
		});
}

module.exports = {
	run
};